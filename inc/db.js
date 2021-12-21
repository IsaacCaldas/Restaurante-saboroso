const mysql = require('mysql2');

const connection = mysql.createConnection({

  host: 'localhost',
  user: 'user',
  database: 'Restaurante_saboroso',
  password: 'password',
  multipleStatements: true // HABILITA VÁRIOS COMANDOS EM UMA QUERY SÓ.
});

module.exports = connection;