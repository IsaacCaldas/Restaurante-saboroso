const conn = require('./db');
const Pagination = require('./Pagination');

module.exports = {

  getReservations(page){

    if(!page) {
      page = 1;
    }

    let pag = new Pagination(

      /* SQL_CALC_FOUND_ROWS: MULTIPLE-STATEMENT: normalmente linguagens de banco de dados só permite um comando por vez, então usamos esse comando para executar na mesma query retornando a quantidade de linhas encontradas. É mais rápido que a função COUNT */

      `
        SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations ORDER BY name LIMIT ?, ?

      `
      /* SELECT FOUND_ROWS() */

      /* LIMIT: 2 parametros: O primeiro é o número da 'página' 
      o segundo limita o tanto de rows que aparecerá pelo valor de limite definido: que no pagination.js está limitado para 10 registros. */
    );

    return pag.getPage(page);
  },

  render(req, res, error, success){

    res.render('reservation', {
      title: 'Reservas - Restaurante Saboroso!',
      background: 'images/img_bg_2.jpg',
      h1: 'Reserve uma mesa!',
      body: req.body,
      error,
      success
    });
  },
  
  save(fields){

    return new Promise((resolve, reject) =>{

      let f = fields;

      if (f.date.indexOf('/') > -1){
        
        let date = f.date.split('/');
        f.date = `${date[2]}-${date[1]}-${date[0]}`;
      }

      let query, params = [
                  f.name,
                  f.email,
                  f.people,
                  f.date,
                  f.time
                ];

      if (parseInt(f.id) > 0){

        params.push(f.id);
        
        query = `
          UPDATE tb_reservations
          SET name = ?,
              email = ?,
              people = ?,
              date = ?,
              time = ?
          WHERE id = ?
        `;

      } else {
        
        query = `
          INSERT INTO tb_reservations (name, email, people, date, time) 
          VALUES(?, ?, ?, ?, ?)
        `;
      }

      conn.query(query, params, (err, results)=>{
        if (err){
          reject(err);
          
        } else {
          resolve(results);
        }
      });
    });
  
  },

  delete(id){

    return new Promise((resolve, reject)=>{

      conn.query(`
        DELETE FROM tb_reservations WHERE id = ?
      `, [
        id
      ], (err, results)=>{

        if(err){
          reject(err);
        } else {
          resolve(results);
        }

      });
    });
  }

}