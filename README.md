# Plataforma Web de Subastas de Vehículos en Tiempo Real (Caso Copart)

Sistema desacoplado de subastas de vehículos importados en tiempo real desarrollado para la evaluación de Desarrollo y Diseño Web (Ingeniería en Sistemas - UMG).

---

## 🌐 Enlace del Proyecto Desplegado
- **Sitio Web en Producción:** https://web-dev-ex2.vercel.app/

---

## 👥 Credenciales de Prueba (Para Pruebas Cruzadas)
Para evaluar la interacción multiusuario en tiempo real sin recargar pantalla, utilice las siguientes cuentas en ventanas separadas o en modo incógnito:

| Rol | Correo Electrónico | Contraseña | Publicaciones Asignadas |
| :--- | :--- | :--- | :--- |
| **Proveedor** | `proveedor@copart.gt` | `Subasta123` | Toyota Corolla LE, Honda CR-V EX |
| **Comprador 1** | `comprador1@copart.gt` | `Subasta123` | Ford Mustang GT / F-150 |
| **Comprador 2** | `comprador2@copart.gt` | `Subasta123` | Postor general |

---

## 🛠️ Arquitectura y Tecnologías
- **Frontend:** React + Vite (Single Page Application).
- **Backend / Persistencia NoSQL:** Firebase Realtime Database (comunicación bidireccional en tiempo real).
- **Autenticación y Seguridad:** Firebase Authentication.
- **Estilos:** Paleta clara corporativa inspirada en Copart (evitando temas oscuros).

---

## 📋 Reglas de Negocio Implementadas
1. **Restricción de Acceso:** Usuarios anónimos únicamente tienen acceso de lectura al catálogo. Es obligatorio iniciar sesión para ofertar o publicar vehículos.
2. **Clasificación Visual de Daño:**
   - 🟢 **Verde:** Daño menor / Limpio.
   - 🟡 **Amarillo:** Daño medio / Reparable.
   - 🔴 **Rojo:** Daño severo / Salvamento.
3. **Galería Interactiva:** Mínimo 5 fotografías por vehículo con carrusel interactivo y navegación por miniaturas.
4. **Filtros Multitarea:** Filtrado combinado por Marca, Estado de Daño, Tipo de Combustible y Año.
5. **Motor de Pujas en Vivo:**
   - La nueva oferta debe ser mayor o igual al monto base.
   - Regla de incremento: Toda nueva puja debe superar la oferta actual por un margen de al menos **10%**.
   - Privacidad garantizada: Únicamente se visualiza el monto de la oferta actual más alta, manteniendo anónima la identidad de los postores.
   - Indicador dinámico de estado: Alerta verde (*"¡Vas ganando esta subasta!"*) y alerta roja (*"Tu oferta ha sido superada"*).
6. **Edición de Publicaciones:** Los usuarios registrados pueden buscar y modificar únicamente las publicaciones que les pertenecen.