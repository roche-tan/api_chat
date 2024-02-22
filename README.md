# API Chat

Repositorio de la creacion de una API para un chat a tiempo real.

Esta API Chat crea chats en tiempo real, utilizando Docker, Node.js, y Socket.io para una experiencia de usuario fluida y eficiente.

## Instalación y Uso

### Requisitos

Hace falta tener instalado Docker.

Para obtener una copia local en funcionamiento, sigue estos pasos:

1. Clona el repositorio.
2. Accede a la carpeta backend y lanza el comandp `docker-compose up -d`. El cual lanzará una instancia mysql en el puerto 3307.
3. Comprueba que las instancias están levantadas.
4. Instala las dependencias con `npm install`.
5. Ejecuta el entorno de desarrollo con `npm run dev`.
6. Accede a la carpeta de frontend y ejecuta el frontend con react `npm start`.

## Características en Desarrollo

- **Chat**: Implementación de la lógica del juego para simular un chat a tiempo real.
- **Interfaz de Usuario**: Desarrollo de una interfaz de usuario intuitiva y atractiva para interactuar con la API.
- **Integración con Bases de Datos**: Configuración de una base de datos para almacenar resultados de juegos y estadísticas de los usuarios. En este caso con mysql

## Documentación API

### Endpoints Disponibles

1. Crear usuario (signup user)

   ```URL: /users/signup
   Método: POST
   Cuerpo de la Petición:
   name: Nombre del usuario (tipo string).
   password: Contraseña del usuario (tipo string).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene la información del usuario creado.

2. Iniciar sesion usuario registrado (login user)

   URL: /users/login
   Método: POST
   Cuerpo de la Petición:
   name: Nombre del usuario (tipo string).
   password: Contraseña del usuario (tipo string).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene la información del usuario autenticado.

3. Crear Sala (create room)

   URL: /chatrooms
   Método: POST
   Cuerpo de la Petición:
   name: Nombre de la sala (tipo string).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene la información de la sala creada.

4. Obtener Lista de Salas (get rooms list)

   URL: /chatrooms
   Método: GET
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene la lista de todas las salas disponibles.

5. Obtener Mensajes de una Sala (get room chat messages)

   URL: /chatrooms/{nombreDeLaSala}
   Método: GET
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene los mensajes de la sala especificada.

## Tecnologías Utilizadas

Este proyecto utiliza una variedad de tecnologías modernas para su desarrollo, incluyendo:

- **Node.js**: Como entorno de ejecución para JavaScript en el servidor.
- **TypeScript**: Para añadir tipado estático al código y mejorar la calidad del desarrollo.
- **Jest**: Para pruebas unitarias y asegurar la calidad del código.
- **Socket.io**: Para poder poder escuchar de los eventos y mantener el chat a tiempo real.
- **Docker**: Facilita el despliegue, la escalabilidad y la gestión de tu API y base de datos, asegurando consistencia y aislamiento en un entorno contenerizado, tanto en desarrollo como en producción.

## Licencia

Este proyecto está bajo la Licencia ISC - vea el archivo `LICENSE` para más detalles.

---

¡Mantente atento para más actualizaciones!
