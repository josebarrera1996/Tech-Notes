# techNotes

Esta aplicación es producto de haber seguido un gran tutorial dictado por el instructor **_Dave Gray_** llamado **_MERN Stack_** al cuál se puede acceder desde el siguiente [enlace](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V)

Tal como se lo indica en el título, se utilizó el stack **'MERN'**, el cual está compuesto por las siguientes tecnologías:

* _MongoDB_
* _Express_
* _ReactJS_ (+ _Redux Toolkit_)
* _NodeJS_

## ¿De qué se trata la aplicación?

**_techNotes_** es una aplicación básica y sencilla en la que se podrán cargar a su sistema 'notas' y los empleados tendrán constancia de ellas y la posibilidad de completarlas e incluso editarlas y borrarlas (siempre y cuando se cumplan ciertas condiciones que se mencionarán).

![](https://i.ibb.co/0DMrd57/tech-Notes.png)


## Aspectos a destacar de esta aplicación:

* Página pública de inicio con cierta información básica de contacto.
* Link en la parte inferior para poder iniciar sesión
* Luego de un inicio de sesión exitoso, se mostrará una página de bienvenida. Notará que en la parte inferior se puede apreciar: el nombre del usuario y su respectivo rol.
* Algo importante a destacar también es que se provee una navegación muy intuitiva y fácil de entender.
* Se requerirá que los usuarios inicien sesión al menos 1 vez por semana.
* Se provee una manera de remover a los empleados lo más rápido posible.
* Las notas son asignadas a determinados empleados.
* Las notas tienen los siguientes campos: title, note body, created & updated dates. Así como el campo 'status' en donde las mismas podrán ser: OPEN o COMPLETED.
* Los usuarios pueden ser: Employees, Managers o Admins
* Las notas solamente pueden ser eliminadas por: Managers o Admins
* Cualquiera de ellos pueden crear notas (cuando el cliente se registre)
* Los 'Employees' solamente pueden ver y editar sus respectivas notas.
* Solamente los 'Managers' y 'Admins' pueden acceder a 'User Settings'. Así como la posibilidad de crear nuevos usuarios.


## Probar techNotes

a) Puede acceder a la misma accediendo a la siguiente dirección:

* [https://technotes-client.onrender.com/](https://technotes-client.onrender.com/)

Los **usuarios** ya creados para poder testearla son:

* **username**: DanD **password**: 12345
* **username**: Mark **password**: 12345
* **username**: Hank **password**: 1234
* **username**: Peter **password**: 12345

b) También tiene la opción de clonar este repositorio y seguir los siguientes pasos para probarla en su computadora:

* En **server** y **client** ejecutar el comando: **npm install**
* Crear una **base de datos** en la cual se alojarán las colecciones y sus respectivos documentos
* En **server** se recomienda crear un archivo **.env** y dentro del mismo colocar las siguientes **variables de entorno**: 
   * NODE_ENV=development (ejemplo)
   * DATABASE_URI=mongodb://localhost/techNotes (ejemplo)
   * ACCESS_TOKEN_SECRET=TuClaveSecreta (ejemplo)
   * REFRESH_TOKEN_SECRET=OtraClaveSecreta (ejemplo)
* Por último ejecutar en ambos directorios (primero en el del _servidor_): **npm run dev**








