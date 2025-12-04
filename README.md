# VAOVA Hotels

Aplicación web para gestionar hoteles y reservas, creada como proyecto de prueba técnica. Permite a los usuarios registrarse, reservar habitaciones y a los hoteles gestionar sus perfiles y ver las reservas.

**Demo en Netlify:** [https://vaova.netlify.app/](https://vaova.netlify.app/)

---

## 📌 Requisitos

- Node.js >= 18
- npm >= 9
- Navegador moderno

---

## 🚀 Instalación

1- Clonar el repositorio:

bash
git clone https://github.com/jun1ormedina16/vaova-hotels.git
cd vaova-hotels

2- Instalar dependencias

npm install

3- Ejecutar localmente

npm run dev

4- Agradecimientos

Gracias por revisar el codigo :D

--

Flujo de funcionamiento de la aplicación
1. Flujo para Hoteles (Administradores)

Registro del hotel
El hotel crea una cuenta proporcionando nombre, correo y contraseña.

Inicio de sesión
El hotel inicia sesión para acceder a su panel administrativo.

Creación de hoteles
El hotel registra sus hoteles agregando:

Nombre

Imagen

Estrellas

Descripción

Ciudad

Cantidad de cuartos disponibles

Gestión completa (CRUD) de hoteles
Desde su dashboard, el hotel puede:

Crear nuevos hoteles

Editar información existente

Eliminar hoteles

Visualizar los hoteles creados

Cierre de sesión
El hotel finaliza su sesión desde el menú o dashboard.

👤 2. Flujo para Usuarios (Clientes)

Registro del usuario
El usuario crea una cuenta con nombre, correo y contraseña.

Inicio de sesión
El usuario inicia sesión para acceder a las funciones de cliente.

Visualización de hoteles
Desde su dashboard, el usuario puede ver todos los hoteles registrados por los hoteles administradores.

Consulta de detalles
El usuario puede abrir cada hotel para ver:

Estrellas

Imagen

Descripción

Ciudad

Habitaciones disponibles

Cierre de sesión
El usuario puede cerrar sesión en cualquier momento.
