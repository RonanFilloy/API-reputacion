La API esta escrita en Node.js y express.
Se conecta al puerto local 5000 y accede a una base de datos hosteada en render (live).

Los requests funcionan de la siguiente forma:

El POST request recibe los campos mostrados en el enunciado y usa 3 funciones de middleware para realizar validaciones:

1- se verifica que el cuerpo del post request no este vacio

2- se verifica que el parametro del request coincida con el nombre de una de las variables a cambiar a mayuscula

3- se verifica que los parametros del cuerpo del post coincidan con los requeridos en el enunciado

Una vez pasados los middleware se cambia a mayuscula el valor del campo especificado, se genera un ID usando uuid, y se guarda la informacion en la base
de datos devolviendo el ID generado en formato JSON

El GET request recibe un ID como parametro y busca en la base de datos el row que tenga ese ID como parametro. En caso de no encontrarlo
devuelve un status 404 indicando que no existe ese elemento en la base de datos. Si lo encuentra devuelve el row entero como especificado en el enunciado.

Para acceder a los requests use Postman, recomiendo usar el mismo metodo. Los datos de autenticacion se mandaran via mail.

Tambien esta incluido un Dockerfile para crear un contenedor de Docker que se conectara al puerto local 5000.
Los comandos para crear el contenedor son: 

docker build -t my-node-app . para el build (my-node-app es el nombre a asignar a la app)

docker run -p 5000:5000 --name my-node-container -d my-node-app para correrlo (my-node-container es el nombre a asignar al contenedor)

El stack usado es: Node.js, Express, JavaScript, uuid, Postgres, Render, Postman, Docker
