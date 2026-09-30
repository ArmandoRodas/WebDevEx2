import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, update, push } from 'firebase/database';
import ImageCarousel from '../components/ImageCarousel';

export default function DetailAuction({ vehiculoId, usuario, onBack, onOpenAuth }) {
  const [vehiculo, setVehiculo] = useState(null);
  const [montoPuja, setMontoPuja] = useState('');
  const [errorPuja, setErrorPuja] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState('');
  const [subastaTerminada, setSubastaTerminada] = useState(false);

  // Escucha activa en tiempo real desde Firebase (Sin F5)
  useEffect(() => {
    const vehiculoRef = ref(db, `vehiculos/${vehiculoId}`);
    const unsubscribe = onValue(vehiculoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVehiculo({ id: vehiculoId, ...data });
        
        // Calcular la siguiente oferta mínima por regla del 10%
        const actual = Number(data.subasta?.ofertaActual || data.subasta?.montoBase || 0);
        const minimoSiguiente = Math.ceil(actual * 1.10);
        setMontoPuja(minimoSiguiente);
      }
    });

    return () => unsubscribe();
  }, [vehiculoId]);

  // Temporizador regresivo en tiempo real
  useEffect(() => {
    if (!vehiculo?.subasta?.fechaFin) return;

    const interval = setInterval(() => {
      const fin = new Date(vehiculo.subasta.fechaFin).getTime();
      const ahora = new Date().getTime();
      const distancia = fin - ahora;

      if (distancia <= 0) {
        setTiempoRestante('SUBASTA CERRADA');
        setSubastaTerminada(true);
        clearInterval(interval);
      } else {
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
        setTiempoRestante(`${horas}h ${minutos}m ${segundos}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [vehiculo?.subasta?.fechaFin]);

  if (!vehiculo) {
    return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Cargando subasta en vivo...</div>;
  }

  const { subasta, fichaTecnica, imagenes, estadoDano } = vehiculo;
  const ofertaActual = Number(subasta?.ofertaActual || subasta?.montoBase || 0);
  const incrementoMinimoPermitido = Math.ceil(ofertaActual * 1.10);

  // Regla de puja y envío en tiempo real a Firebase
  const ejecutarPuja = async (e) => {
    e.preventDefault();
    setErrorPuja('');

    if (!usuario) {
      onOpenAuth();
      return;
    }

    if (subastaTerminada) {
      setErrorPuja('La subasta ya concluyó. No se admiten más ofertas.');
      return;
    }

    const ofertaNumerica = Number(montoPuja);

    if (ofertaNumerica < subasta.montoBase) {
      setErrorPuja(`La oferta no puede ser menor al monto base (Q. ${Number(subasta.montoBase).toLocaleString()})`);
      return;
    }

    if (ofertaNumerica < incrementoMinimoPermitido) {
      setErrorPuja(`Toda nueva puja debe superar la actual en al menos un 10%. Mínimo requerido: Q. ${incrementoMinimoPermitido.toLocaleString()}`);
      return;
    }

    try {
      // 1. Actualizar el auto con la oferta líder y el postor actual
      await update(ref(db, `vehiculos/${vehiculoId}/subasta`), {
        ofertaActual: ofertaNumerica,
        ultimoPostorId: usuario.uid
      });

      // 2. Registrar en el historial de pujas anónimo para trazabilidad
      await push(ref(db, `pujas/${vehiculoId}`), {
        monto: ofertaNumerica,
        timestamp: new Date().toISOString(),
        usuarioAnonimo: `Postor #${usuario.uid.substring(0, 4)}`
      });

      setErrorPuja('');
    } catch (err) {
      setErrorPuja('Error al procesar la oferta: ' + err.message);
    }
  };

  // Determinación de los badges obligatorios
  const soyUltimoPostor = usuario && subasta.ultimoPostorId === usuario.uid;
  const huboOfertas = Boolean(subasta.ultimoPostorId);

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#004b87', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        ← Volver al Inventario
      </button>

      {/* Indicador Dinámico de Estado Exigido en la Rúbrica */}
      {usuario && (
        <div style={{ marginBottom: '1.5rem' }}>
          {soyUltimoPostor ? (
            <div style={{ backgroundColor: '#dcfce7', border: '1px solid #16a34a', color: '#15803d', padding: '1rem', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏆</span> ¡Vas ganando esta subasta con una oferta de Q. {ofertaActual.toLocaleString()}!
            </div>
          ) : huboOfertas ? (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #dc2626', color: '#991b1b', padding: '1rem', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span> Tu oferta ha sido superada. ¡Haz tu oferta ahora antes de que termine el tiempo!
            </div>
          ) : null}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Columna Izquierda: Carrusel de Fotos */}
        <div>
          <ImageCarousel imagenes={imagenes} />
          
          {/* Ficha Técnica Detallada */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem' }}>
            <h3 style={{ color: '#004b87', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
              Ficha Técnica Oficial
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.9rem' }}>
              <div><strong>Año:</strong> {fichaTecnica?.anio}</div>
              <div><strong>Tipo:</strong> {fichaTecnica?.tipo}</div>
              <div><strong>Marca:</strong> {fichaTecnica?.marca}</div>
              <div><strong>Modelo:</strong> {fichaTecnica?.modelo}</div>
              <div><strong>Motor:</strong> {fichaTecnica?.motor}</div>
              <div><strong>Cilindros:</strong> {fichaTecnica?.cilindros}</div>
              <div><strong>Transmisión:</strong> {fichaTecnica?.transmision}</div>
              <div><strong>Tracción:</strong> {fichaTecnica?.traccion}</div>
              <div><strong>Combustible:</strong> {fichaTecnica?.combustible}</div>
              <div><strong>Nivel de Daño:</strong> {estadoDano?.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel de Pujas e Interacción */}
        <div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.8rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>SUBASTA EN TIEMPO REAL</span>
            <h2 style={{ fontSize: '1.8rem', color: '#004b87', margin: '4px 0 1rem' }}>
              {fichaTecnica?.marca} {fichaTecnica?.modelo} {fichaTecnica?.anio}
            </h2>

            {/* Reloj de Tiempo */}
            <div style={{ backgroundColor: subastaTerminada ? '#fee2e2' : '#f3f4f6', padding: '0.8rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>⏱️ Tiempo Restante:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: subastaTerminada ? '#dc2626' : '#004b87' }}>
                {tiempoRestante}
              </span>
            </div>

            {/* Montos Actuales (Privacidad estricta de postores) */}
            <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Monto Base de Apertura:</span>
                <strong>Q. {Number(subasta?.montoBase || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: '#6b7280', fontSize: '1.1rem' }}>Oferta Actual Más Alta:</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#004b87' }}>
                  Q. {ofertaActual.toLocaleString()}
                </span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                🔒 Identidad del postor protegida por privacidad
              </div>
            </div>

            {/* Formulario de Puja con Regla del 10% */}
            {subastaTerminada ? (
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px', color: '#6b7280' }}>
                {ofertaActual >= subasta.montoBase 
                  ? 'Subasta concluida exitosamente.' 
                  : 'Subasta declarada desierta (no se alcanzó el precio base).'}
              </div>
            ) : usuario ? (
              <form onSubmit={ejecutarPuja} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {errorPuja && (
                  <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {errorPuja}
                  </div>
                )}
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px', fontWeight: 600 }}>
                    Tu Oferta en Quetzales (Mínimo: Q. {incrementoMinimoPermitido.toLocaleString()} [+10%]):
                  </label>
                  <input 
                    type="number" 
                    required 
                    min={incrementoMinimoPermitido}
                    step="100"
                    value={montoPuja} 
                    onChange={(e) => setMontoPuja(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '1.2rem', fontWeight: 700 }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '0.8rem', fontSize: '1.05rem' }}>
                  ⚡ Enviar Puja en Tiempo Real
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px' }}>
                <p style={{ color: '#4b5563', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
                  Debes iniciar sesión para ofertar en esta subasta.
                </p>
                <button className="btn-primary" onClick={onOpenAuth}>
                  Iniciar Sesión para Pujar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}