import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, push, update } from 'firebase/database';

export default function PublishVehicle({ usuario, vehiculoAEditar, onFinish, onCancel }) {
  const [formData, setFormData] = useState({
    anio: 2022,
    tipo: 'Sedan',
    marca: '',
    modelo: '',
    motor: '',
    transmision: 'Automatica',
    combustible: 'Gasolina',
    traccion: 'FWD',
    cilindros: 4,
    estadoDano: 'verde',
    montoBase: 20000,
    fechaInicio: new Date().toISOString().slice(0, 16),
    fechaFin: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), // 2 días después
    // Mínimo 5 fotos requeridas por el examen
    foto1: '',
    foto2: '',
    foto3: '',
    foto4: '',
    foto5: ''
  });

  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (vehiculoAEditar) {
      const ft = vehiculoAEditar.fichaTecnica || {};
      const sub = vehiculoAEditar.subasta || {};
      const imgs = vehiculoAEditar.imagenes || [];

      setFormData({
        anio: ft.anio || 2022,
        tipo: ft.tipo || 'Sedan',
        marca: ft.marca || '',
        modelo: ft.modelo || '',
        motor: ft.motor || '',
        transmision: ft.transmision || 'Automatica',
        combustible: ft.combustible || 'Gasolina',
        traccion: ft.traccion || 'FWD',
        cilindros: ft.cilindros || 4,
        estadoDano: vehiculoAEditar.estadoDano || 'verde',
        montoBase: sub.montoBase || 20000,
        fechaInicio: sub.fechaInicio ? sub.fechaInicio.slice(0, 16) : '',
        fechaFin: sub.fechaFin ? sub.fechaFin.slice(0, 16) : '',
        foto1: imgs[0] || '',
        foto2: imgs[1] || '',
        foto3: imgs[2] || '',
        foto4: imgs[3] || '',
        foto5: imgs[4] || ''
      });
    }
  }, [vehiculoAEditar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Fotos por defecto si el usuario no pone links propios
    const fotosDefault = [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80"
    ];

    const imagenesArray = [
      formData.foto1.trim() || fotosDefault[0],
      formData.foto2.trim() || fotosDefault[1],
      formData.foto3.trim() || fotosDefault[2],
      formData.foto4.trim() || fotosDefault[3],
      formData.foto5.trim() || fotosDefault[4]
    ];

    const payload = {
      creadorId: usuario.uid,
      creadorEmail: usuario.email,
      estadoDano: formData.estadoDano,
      imagenes: imagenesArray,
      fichaTecnica: {
        anio: Number(formData.anio),
        tipo: formData.tipo,
        marca: formData.marca,
        modelo: formData.modelo,
        motor: formData.motor,
        transmision: formData.transmision,
        combustible: formData.combustible,
        traccion: formData.traccion,
        cilindros: Number(formData.cilindros)
      },
      subasta: {
        montoBase: Number(formData.montoBase),
        ofertaActual: vehiculoAEditar ? vehiculoAEditar.subasta.ofertaActual : Number(formData.montoBase),
        ultimoPostorId: vehiculoAEditar ? vehiculoAEditar.subasta.ultimoPostorId || "" : "",
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString()
      }
    };

    setGuardando(true);
    try {
      if (vehiculoAEditar) {
        await update(ref(db, `vehiculos/${vehiculoAEditar.id}`), payload);
      } else {
        await push(ref(db, 'vehiculos'), payload);
      }
      onFinish();
    } catch (err) {
      setError('Error al registrar publicación: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem', maxWidth: '800px' }}>
      <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#004b87', marginBottom: '0.5rem' }}>
          {vehiculoAEditar ? '✏️ Editar Vehículo en Subasta' : '🚗 Publicar Nuevo Vehículo'}
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Complete la ficha técnica detallada y los parámetros de la subasta.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Ficha Técnica */}
          <h3 style={{ fontSize: '1rem', color: '#374151', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' }}>
            1. Ficha Técnica Oficial
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Marca *</label>
              <input required name="marca" value={formData.marca} onChange={handleChange} placeholder="Ej. Toyota" className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Modelo *</label>
              <input required name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Ej. Tacoma SR5" className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Año *</label>
              <input required type="number" name="anio" value={formData.anio} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Tipo de Artículo *</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} className="input-field">
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Pickup">Pickup</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Motor *</label>
              <input required name="motor" value={formData.motor} onChange={handleChange} placeholder="Ej. 2.7L 4-Cyl" className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Cilindros *</label>
              <input required type="number" name="cilindros" value={formData.cilindros} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Transmisión *</label>
              <select name="transmision" value={formData.transmision} onChange={handleChange} className="input-field">
                <option value="Automatica">Automática</option>
                <option value="Mecanica">Mecánica / Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Combustible *</label>
              <select name="combustible" value={formData.combustible} onChange={handleChange} className="input-field">
                <option value="Gasolina">Gasolina</option>
                <option value="Diesel">Diesel</option>
                <option value="Hibrido">Híbrido</option>
                <option value="Electrico">Eléctrico</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Tren de Manejo (Tracción) *</label>
              <select name="traccion" value={formData.traccion} onChange={handleChange} className="input-field">
                <option value="FWD">FWD (Delantera)</option>
                <option value="RWD">RWD (Trasera)</option>
                <option value="AWD">AWD (Integral)</option>
                <option value="4WD">4WD (4x4)</option>
              </select>
            </div>
          </div>

          {/* Clasificación de Daño Exigida */}
          <h3 style={{ fontSize: '1rem', color: '#374151', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem', marginTop: '0.5rem' }}>
            2. Clasificación del Estado de Daño
          </h3>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Estado Visual *</label>
            <select name="estadoDano" value={formData.estadoDano} onChange={handleChange} className="input-field">
              <option value="verde">🟢 Verde: Daño menor / Limpio</option>
              <option value="amarillo">🟡 Amarillo: Daño medio / Reparable</option>
              <option value="rojo">🔴 Rojo: Daño severo / Salvamento</option>
            </select>
          </div>

          {/* Galería de Mínimo 5 Fotos */}
          <h3 style={{ fontSize: '1rem', color: '#374151', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem', marginTop: '0.5rem' }}>
            3. Galería Fotográfica (Mínimo 5 enlaces de imágenes)
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>* Si dejas un campo vacío, se asignará automáticamente una imagen de vehículo de alta resolución.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input name="foto1" value={formData.foto1} onChange={handleChange} placeholder="URL Foto 1 (Principal)" className="input-field" />
            <input name="foto2" value={formData.foto2} onChange={handleChange} placeholder="URL Foto 2 (Lateral)" className="input-field" />
            <input name="foto3" value={formData.foto3} onChange={handleChange} placeholder="URL Foto 3 (Trasera)" className="input-field" />
            <input name="foto4" value={formData.foto4} onChange={handleChange} placeholder="URL Foto 4 (Interior)" className="input-field" />
            <input name="foto5" value={formData.foto5} onChange={handleChange} placeholder="URL Foto 5 (Motor)" className="input-field" />
          </div>

          {/* Parámetros de la Subasta */}
          <h3 style={{ fontSize: '1rem', color: '#374151', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem', marginTop: '0.5rem' }}>
            4. Parámetros de la Subasta
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Monto Base de Apertura (Q.) *</label>
              <input required type="number" name="montoBase" min="1000" value={formData.montoBase} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Fecha y Hora de Inicio *</label>
              <input required type="datetime-local" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>Fecha y Hora de Cierre *</label>
              <input required type="datetime-local" name="fechaFin" value={formData.fechaFin} onChange={handleChange} className="input-field" />
            </div>
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={guardando} className="btn-primary" style={{ flexGrow: 1, padding: '0.8rem' }}>
              {guardando ? 'Guardando...' : (vehiculoAEditar ? '💾 Guardar Cambios' : '🚀 Publicar para Subasta')}
            </button>
            <button type="button" onClick={onCancel} style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.8rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}