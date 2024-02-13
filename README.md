# API Chat

Repositorio de la creacion de una API para un chat.

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

1. Crear Jugador

   ```URL: /users
   Método: POST
   Cuerpo de la Petición:
   name: Nombre del jugador (tipo string).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene la información del jugador creado.

## Tecnologías Utilizadas

Este proyecto utiliza una variedad de tecnologías modernas para su desarrollo, incluyendo:

- **Node.js**: Como entorno de ejecución para JavaScript en el servidor.
- **TypeScript**: Para añadir tipado estático al código y mejorar la calidad del desarrollo.
- **Jest**: Para pruebas unitarias y asegurar la calidad del código.
- **Socket.io**: Para poder mantener la conexión de los eventos y mantener el chat a tiempo real.


## Licencia

Este proyecto está bajo la Licencia ISC - vea el archivo `LICENSE` para más detalles.

---

¡Mantente atento para más actualizaciones!
