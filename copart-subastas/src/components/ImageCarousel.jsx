import React, { useState } from 'react';

export default function ImageCarousel({ imagenes = [] }) {
  const [indiceActual, setIndiceActual] = useState(0);

  // Asegurar que siempre existan imágenes visibles
  const fotos = imagenes.length > 0 ? imagenes : [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80'
  ];

  const anterior = () => {
    setIndiceActual((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const siguiente = () => {
    setIndiceActual((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {/* Contenedor Principal de la Foto */}
      <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
        <img 
          src={fotos[indiceActual]} 
          alt={`Fotografía ${indiceActual + 1}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Controles de Navegación */}
        <button 
          onClick={anterior}
          style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold'
          }}
        >
          ‹
        </button>

        <button 
          onClick={siguiente}
          style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold'
          }}
        >
          ›
        </button>

        <div style={{ position: 'absolute', bottom: '10px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
          Foto {indiceActual + 1} de {fotos.length}
        </div>
      </div>

      {/* Tira de Miniaturas */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {fotos.map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            alt={`Miniatura ${idx + 1}`}
            onClick={() => setIndiceActual(idx)}
            style={{
              width: '72px', height: '52px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer',
              border: indiceActual === idx ? '2px solid #004b87' : '1px solid #d1d5db',
              opacity: indiceActual === idx ? 1 : 0.6
            }}
          />
        ))}
      </div>
    </div>
  );
}