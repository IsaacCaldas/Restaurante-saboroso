const conn = require('./db');

module.exports = {

  getReservations(){

    return new Promise((resolve, reject) => {
      
      conn.query(`
        SELECT * FROM tb_reservations ORDER BY date DESC
      `, (err, results) =>{
        if(err){
          reject(err);
        } 

        resolve(results);

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
              people = ?
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