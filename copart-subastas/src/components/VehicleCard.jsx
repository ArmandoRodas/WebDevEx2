import React from 'react';

export default function VehicleCard({ vehiculo, onSelect, onEdit, esDuenio }) {
  const getBadgeDano = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'verde':
        return <span className="badge-damage badge-verde">🟢 Limpio / Daño Menor</span>;
      case 'amarillo':
        return <span className="badge-damage badge-amarillo">🟡 Daño Medio / Reparable</span>;
      case 'rojo':
        return <span className="badge-damage badge-rojo">🔴 Daño Severo / Salvamento</span>;
      default:
        return <span className="badge-damage badge-verde">🟢 Limpio</span>;
    }
  };

  const fotoPrincipal = vehiculo.imagenes && vehiculo.imagenes.length > 0 
    ? vehiculo.imagenes[0] 
    : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=60';

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      <div style={{ position: 'relative', height: '190px', backgroundColor: '#e5e7eb' }}>
        <img 
          src={fotoPrincipal} 
          alt={`${vehiculo.fichaTecnica?.marca} ${vehiculo.fichaTecnica?.modelo}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          {getBadgeDano(vehiculo.estadoDano)}
        </div>
      </div>

      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.6rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>
            {vehiculo.fichaTecnica?.anio} • {vehiculo.fichaTecnica?.tipo}
          </span>
          <h3 style={{ fontSize: '1.2rem', color: '#004b87', fontWeight: 700, margin: '2px 0' }}>
            {vehiculo.fichaTecnica?.marca} {vehiculo.fichaTecnica?.modelo}
          </h3>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4' }}>
          <p>⚙️ <strong>Motor:</strong> {vehiculo.fichaTecnica?.motor} ({vehiculo.fichaTecnica?.cilindros} Cil.)</p>
          <p>🕹️ <strong>Transmisión:</strong> {vehiculo.fichaTecnica?.transmision} | {vehiculo.fichaTecnica?.traccion}</p>
          <p>⛽ <strong>Combustible:</strong> {vehiculo.fichaTecnica?.combustible}</p>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Oferta Actual:</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#004b87' }}>
              Q. {Number(vehiculo.subasta?.ofertaActual || vehiculo.subasta?.montoBase || 0).toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-primary" 
              onClick={() => onSelect(vehiculo)}
              style={{ flexGrow: 1, padding: '0.5rem' }}
            >
              Entrar a la Subasta
            </button>
            {esDuenio && (
              <button 
                onClick={() => onEdit(vehiculo)}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                ✏️ Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}