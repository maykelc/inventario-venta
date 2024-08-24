const mysql = require('mysql2/promise');

let connection;

async function connectDB(){
    if (!connection){
        try{
            console.log('Conexion no establecida aun, conectando...');
            connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'ventaproducto'
            });
            console.log('Conectado a la base de datos como id:  ' + connection.threadId);
        }catch(err){
            console.error('Error de conexión a la base de datos:', err);
            throw err;
        }
    }
    return connection;
}

function getConnection(){
    if(!connection){
        return connectDB(); // Corregido aquí
    }
    return connection;
}

module.exports = { getConnection };
