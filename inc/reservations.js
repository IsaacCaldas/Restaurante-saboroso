const conn = require('./db');
const Pagination = require('./Pagination');

var moment = require('moment');

module.exports = {

  getReservations(req){

    return new Promise((resolve, reject) => {
      
      let page = req.query.page;
      let dtStart = req.query.start;
      let dtEnd = req.query.end;

      if(!page) {
        page = 1;
      }
  
      let params = [];
  
      if(dtStart && dtEnd){
  
        params.push(dtStart, dtEnd);
      }
  
      let pag = new Pagination(
  
        /* SQL_CALC_FOUND_ROWS: MULTIPLE-STATEMENT: normalmente linguagens de banco de dados só permite um comando por vez, então usamos esse comando para executar na mesma query retornando a quantidade de linhas encontradas. É mais rápido que a função COUNT */
  
        `
          SELECT SQL_CALC_FOUND_ROWS * 
          FROM tb_reservations
          ${(dtStart && dtEnd) ? 'WHERE date BETWEEN ? AND ?' : ''}
          ORDER BY name LIMIT ?, ?
  
        `
        /* SELECT FOUND_ROWS() */
  
        /* LIMIT: 2 parametros: O primeiro é o número da 'página' 
        o segundo limita o tanto de rows que aparecerá pelo valor de limite definido: que no pagination.js está limitado para 10 registros. */
      ,
        params
      );
  
      pag.getPage(page).then(data => {

        resolve({
          data,
          links: pag.getNavigation(req.query)
        });
      });

    });
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
  },

  chart(req){
    
    return new Promise((resolve, reject) => {

      conn.query(`
          SELECT
            CONCAT(YEAR(date), '-', MONTH(date)) AS date, 
            COUNT(*) AS total,
            SUM(people) / COUNT(*) AS avg_people
          FROM tb_reservations
          WHERE
            date BETWEEN ? AND ?
          GROUP BY YEAR(date) DESC, MONTH(date) DESC
          ORDER BY YEAR(date) DESC, MONTH(date) DESC;)
      `, [
        req.query.start,
        req.query.end
      ], (err, results)=> {

        if (err ){
          reject(err);

        } else {

          let months = [];
          let values = [];

          results.forEach(row =>{

            months.push(moment(row.date).format('MMM YYYY'));
            values.push(row.total);

          });

          resolve({
            months,
            values
          });

        }
      });
    });
  }

}