const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

connection.connect((error)=>{
    if(error){
        console.log('Error de conexión: ' + error);
        return;
    }
    console.log('Conexión a la base de datos exitosa.');
});

module.exports = connection; 