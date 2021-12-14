var conn = require('./db');

module.exports = {

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

      let date = f.date.split('/');
      f.date = `${date[2]}-${date[1]}-${date[0]}`;

      conn.query(`
        INSERT INTO tb_reservations (name, email, people, date, time) 
        VALUES(?, ?, ?, ?, ?)
      `, [
        f.name,
        f.email,
        f.people,
        f.date,
        f.time
      ], (err, results)=>{
  
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

}