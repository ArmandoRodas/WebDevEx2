import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

export default function AuthModal({ isOpen, onClose }) {
  const [esLogin, setEsLogin] = useState(true);
  const [error, setError] = useState('');
  
  // Campos requeridos por el examen
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (esLogin) {
        await signInWithEmailAndPassword(auth, formData.correo, formData.password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, formData.correo, formData.password);
        const uid = userCred.user.uid;
        
        // Guardar perfil de usuario completo en NoSQL
        await set(ref(db, `usuarios/${uid}`), {
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          telefono: formData.telefono,
          fechaRegistro: new Date().toISOString()
        });
      }
      onClose();
    } catch (err) {
      setError(err.message.includes('auth/invalid-credential') 
        ? 'Credenciales inválidas. Verifica tu correo y contraseña.' 
        : err.message);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1rem', color: '#004b87' }}>
          {esLogin ? 'Iniciar Sesión' : 'Registro de Usuario'}
        </h2>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.6rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {!esLogin && (
            <>
              <input required name="nombre" placeholder="Nombre" className="input-field" onChange={handleChange} />
              <input required name="apellido" placeholder="Apellido" className="input-field" onChange={handleChange} />
              <input required name="telefono" placeholder="Teléfono (+502 ...)" className="input-field" onChange={handleChange} />
            </>
          )}
          <input required type="email" name="correo" placeholder="Correo electrónico" className="input-field" onChange={handleChange} />
          <input required type="password" name="password" placeholder="Contraseña segura" className="input-field" onChange={handleChange} />

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            {esLogin ? 'Entrar a Subastas' : 'Completar Registro'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
          {esLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button 
            type="button"
            onClick={() => setEsLogin(!esLogin)} 
            style={{ background: 'none', border: 'none', color: '#004b87', fontWeight: 600, cursor: 'pointer' }}
          >
            {esLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
          </button>
        </p>

        <button 
          onClick={onClose} 
          style={{ width: '100%', background: 'none', border: 'none', color: '#9ca3af', marginTop: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Cerrar ventana
        </button>
      </div>
    </div>
  );
}