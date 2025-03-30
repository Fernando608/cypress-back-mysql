const { defineConfig } = require('cypress');
const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async queryDb(query) {
          // Primero intenta usar la URL pública completa si está disponible
          let connection;
          
          try {
            if (process.env.MYSQL_PUBLIC_URL) {
              // Usar la URL pública directamente
              connection = await mysql.createConnection(process.env.MYSQL_PUBLIC_URL);
            } else if (process.env.MYSQL_URL) {
              // O usar la URL normal
              connection = await mysql.createConnection(process.env.MYSQL_URL);
            } else {
              // O construir la conexión con parámetros individuales
              connection = await mysql.createConnection({
                host: process.env.MYSQLHOST,
                user: process.env.MYSQLUSER,
                password: process.env.MYSQLPASSWORD,
                database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE,
                port: process.env.MYSQLPORT || 3306
              });
            }
            
            // Ejecutar la consulta
            const [rows] = await connection.execute(query);
            await connection.end();
            return rows;
          } catch (error) {
            console.error('Error de conexión a la base de datos:', error);
            if (connection) await connection.end();
            throw error;
          }
        }
      });
      
      // Para depuración: mostrar las variables de entorno (sin passwords)
      console.log('Variables de entorno disponibles:');
      console.log('MYSQLHOST:', process.env.MYSQLHOST);
      console.log('MYSQLPORT:', process.env.MYSQLPORT);
      console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE);
      console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
      console.log('MYSQLUSER:', process.env.MYSQLUSER);
      console.log('URL disponible:', Boolean(process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL));
      
      return config;
    },
  },
});