import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import Navbar from './components/Navbar';
import AuthModal from './views/AuthModal';
import CatalogView from './views/CatalogView';
import DetailAuction from './views/DetailAuction';
import PublishVehicle from './views/PublishVehicle';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [modalAuthAbierto, setModalAuthAbierto] = useState(false);
  const [vistaActual, setVistaActual] = useState('catalogo'); // 'catalogo' | 'subasta' | 'publicar'
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState(null);
  const [vehiculoAEditar, setVehiculoAEditar] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUsuario(usr);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectVehiculo = (vehiculo) => {
    setVehiculoSeleccionadoId(vehiculo.id);
    setVistaActual('subasta');
  };

  const handleEditarVehiculo = (vehiculo) => {
    setVehiculoAEditar(vehiculo);
    setVistaActual('publicar');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        usuario={usuario}
        onOpenAuth={() => setModalAuthAbierto(true)}
        setVistaActual={(vista) => {
          setVehiculoAEditar(null);
          setVistaActual(vista);
        }}
        vistaActual={vistaActual}
      />

      <main style={{ flexGrow: 1 }}>
        {vistaActual === 'catalogo' && (
          <CatalogView 
            usuario={usuario}
            onSelectVehiculo={handleSelectVehiculo}
            onEditarVehiculo={handleEditarVehiculo}
          />
        )}

        {vistaActual === 'subasta' && (
          <DetailAuction 
            vehiculoId={vehiculoSeleccionadoId}
            usuario={usuario}
            onBack={() => setVistaActual('catalogo')}
            onOpenAuth={() => setModalAuthAbierto(true)}
          />
        )}

        {vistaActual === 'publicar' && (
          <PublishVehicle 
            usuario={usuario}
            vehiculoAEditar={vehiculoAEditar}
            onFinish={() => {
              setVehiculoAEditar(null);
              setVistaActual('catalogo');
            }}
            onCancel={() => {
              setVehiculoAEditar(null);
              setVistaActual('catalogo');
            }}
          />
        )}
      </main>

      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '1.5rem 0', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
        <div className="container">
          Plataforma de Subastas de Vehículos Tipo Copart — Proyecto Examen WebDev 2026
        </div>
      </footer>

      <AuthModal 
        isOpen={modalAuthAbierto}
        onClose={() => setModalAuthAbierto(false)}
      />
    </div>
  );
}