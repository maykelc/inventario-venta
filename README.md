******* Inventario y Venta ******* 

Este es un sistema de gestión de inventarios y ventas desarrollado con Electron y MySQL. La aplicación permite administrar productos, categorías, marcas, vendedores, y realizar ventas, todo desde una interfaz de usuario amigable.


- Características

Gestión de productos: Añade, edita y elimina productos.
Categorías y marcas: Organiza productos en categorías y asocia cada uno con una marca.
Control de ventas: Realiza ventas y guarda el historial de ventas.
Seguridad: Cada vendedor tiene un nombre de usuario y contraseña.

- Instalación

Requisitos previos:
Node.js (versión 14 o superior)
XAMPP (para levantar la base de datos MySQL)
Configuración de la base de datos con XAMPP

Instala XAMPP:
Descarga e instala XAMPP desde Apache.


- Clonar el repositorio
  
git clone https://github.com/maykelc/inventario-venta.git
cd inventario-venta

- Instalación de dependencias

npm install


*** REVISA LA CONFIGURACION DE DB.JS QUE SE ENCUENTRA EN MAIN, PARA CONFIGURAR LA BASE DE DATOS ***


- Ejecución de la aplicación

npm start


- Uso

Inicia la aplicación utilizando npm start.
Navega a través de las diferentes secciones para gestionar categorías, marcas, productos y ventas.
Utiliza la opción de "Ventas" para registrar nuevas ventas y gestionar el inventario.


- Contribución

** Si deseas contribuir al proyecto, por favor sigue estos pasos:

Haz un fork del repositorio.
Crea una nueva rama (git checkout -b feature/nueva-caracteristica).
Realiza tus cambios y haz un commit (git commit -m 'Agrega una nueva característica').
Sube los cambios (git push origin feature/nueva-caracteristica).
Abre un Pull Request.

- Licencia

Este proyecto está bajo la licencia MIT.
