import React from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function Navbar({ usuario, onOpenAuth, setVistaActual, vistaActual }) {
  const cerrarSesion = async () => {
    await signOut(auth);
  };

  return (
    <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 
            onClick={() => setVistaActual('catalogo')}
            style={{ fontSize: '1.4rem', fontWeight: 800, color: '#004b87', cursor: 'pointer', letterSpacing: '-0.5px' }}
          >
            COPART <span style={{ color: '#ef4444' }}>SUBASTAS</span>
          </h1>
          <button 
            onClick={() => setVistaActual('catalogo')}
            style={{ background: 'none', border: 'none', fontWeight: 600, color: vistaActual === 'catalogo' ? '#004b87' : '#6b7280', cursor: 'pointer' }}
          >
            Inventario Global
          </button>
          <button 
            onClick={() => {
              if (!usuario) {
                onOpenAuth();
              } else {
                setVistaActual('publicar');
              }
            }}
            style={{ background: 'none', border: 'none', fontWeight: 600, color: vistaActual === 'publicar' ? '#004b87' : '#6b7280', cursor: 'pointer' }}
          >
            + Publicar Vehículo
          </button>
        </div>

        <div>
          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                👤 {usuario.email}
              </span>
              <button 
                onClick={cerrarSesion}
                style={{ padding: '0.4rem 0.8rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Salir
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={onOpenAuth}>
              Ingresar / Registrarse
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}