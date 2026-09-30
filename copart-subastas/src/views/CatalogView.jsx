import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import VehicleCard from '../components/VehicleCard';

export default function CatalogView({ usuario, onSelectVehiculo, onEditarVehiculo }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados de filtros multitarea
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroDano, setFiltroDano] = useState('');
  const [filtroCombustible, setFiltroCombustible] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');

  useEffect(() => {
    const vehiculosRef = ref(db, 'vehiculos');
    const unsubscribe = onValue(vehiculosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setVehiculos(lista);
      } else {
        // Datos semilla iniciales si la base de datos está vacía
        sembrarDatosIniciales();
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const sembrarDatosIniciales = async () => {
    const ahora = new Date();
    const manana = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const dataSeed = {
      "demo_auto_1": {
        creadorId: "proveedor@copart.gt",
        creadorEmail: "proveedor@copart.gt",
        estadoDano: "verde",
        imagenes: [
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80"
        ],
        fichaTecnica: {
          anio: 2022,
          tipo: "Sedan",
          marca: "Toyota",
          modelo: "Corolla LE",
          motor: "1.8L",
          transmision: "Automatica",
          combustible: "Gasolina",
          traccion: "FWD",
          cilindros: 4
        },
        subasta: {
          montoBase: 25000,
          ofertaActual: 25000,
          ultimoPostorId: "",
          fechaInicio: ahora.toISOString(),
          fechaFin: manana.toISOString()
        }
      },
      "demo_auto_2": {
        creadorId: "proveedor@copart.gt",
        creadorEmail: "proveedor@copart.gt",
        estadoDano: "amarillo",
        imagenes: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop&q=80"
        ],
        fichaTecnica: {
          anio: 2021,
          tipo: "SUV",
          marca: "Honda",
          modelo: "CR-V EX",
          motor: "1.5L Turbo",
          transmision: "CVT",
          combustible: "Gasolina",
          traccion: "AWD",
          cilindros: 4
        },
        subasta: {
          montoBase: 45000,
          ofertaActual: 45000,
          ultimoPostorId: "",
          fechaInicio: ahora.toISOString(),
          fechaFin: manana.toISOString()
        }
      },
      "demo_auto_3": {
        creadorId: "comprador1@copart.gt",
        creadorEmail: "comprador1@copart.gt",
        estadoDano: "rojo",
        imagenes: [
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80"
        ],
        fichaTecnica: {
          anio: 2020,
          tipo: "Pickup",
          marca: "Ford",
          modelo: "F-150 XLT",
          motor: "3.5L V6 EcoBoost",
          transmision: "Automatica",
          combustible: "Gasolina",
          traccion: "4WD",
          cilindros: 6
        },
        subasta: {
          montoBase: 50000,
          ofertaActual: 50000,
          ultimoPostorId: "",
          fechaInicio: ahora.toISOString(),
          fechaFin: manana.toISOString()
        }
      }
    };

    await set(ref(db, 'vehiculos'), dataSeed);
  };

  // Filtrado reactivo en cliente
  const vehiculosFiltrados = vehiculos.filter((v) => {
    const ft = v.fichaTecnica || {};
    const cumpleMarca = filtroMarca ? ft.marca?.toLowerCase().includes(filtroMarca.toLowerCase()) : true;
    const cumpleDano = filtroDano ? v.estadoDano?.toLowerCase() === filtroDano.toLowerCase() : true;
    const cumpleCombustible = filtroCombustible ? ft.combustible?.toLowerCase() === filtroCombustible.toLowerCase() : true;
    const cumpleAnio = filtroAnio ? String(ft.anio) === String(filtroAnio) : true;
    return cumpleMarca && cumpleDano && cumpleCombustible && cumpleAnio;
  });

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      {/* Banner Superior Estilo Copart */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ color: '#004b87', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Inventario de Subastas en Vivo
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
          Encuentre vehículos importados listos para puja interactiva en tiempo real.
        </p>

        {/* Filtros Multitarea */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="🔍 Filtrar por Marca..." 
            className="input-field" 
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
          />

          <select 
            className="input-field" 
            value={filtroDano}
            onChange={(e) => setFiltroDano(e.target.value)}
          >
            <option value="">Todos los Estados de Daño</option>
            <option value="verde">🟢 Verde: Limpio / Daño Menor</option>
            <option value="amarillo">🟡 Amarillo: Daño Medio / Reparable</option>
            <option value="rojo">🔴 Rojo: Daño Severo / Salvamento</option>
          </select>

          <select 
            className="input-field" 
            value={filtroCombustible}
            onChange={(e) => setFiltroCombustible(e.target.value)}
          >
            <option value="">Cualquier Combustible</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Hibrido">Híbrido</option>
            <option value="Electrico">Eléctrico</option>
          </select>

          <input 
            type="number" 
            placeholder="Año (Ej. 2021)" 
            className="input-field" 
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
          />
        </div>
      </div>

      {/* Grid del Catálogo */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          Sincronizando inventario con Firebase...
        </div>
      ) : vehiculosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No se encontraron vehículos con los filtros seleccionados.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {vehiculosFiltrados.map((v) => (
            <VehicleCard 
              key={v.id} 
              vehiculo={v} 
              onSelect={onSelectVehiculo} 
              onEdit={onEditarVehiculo}
              esDuenio={usuario && (v.creadorId === usuario.uid || v.creadorEmail === usuario.email)}
            />
          ))}
        </div>
      )}
    </div>
  );
}