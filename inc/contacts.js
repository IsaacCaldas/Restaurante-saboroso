const conn = require('./db');

module.exports = {

  render(req, res, error, success){

    res.render('contact', {
      title: 'Contato - Restaurante Saboroso!',
      background: 'images/img_bg_3.jpg',
      h1: 'Diga um oi!',
      body: req.body,
      error,
      success
    });
  },
  
  save(fields){

    return new Promise((resolve, reject) =>{

      let f = fields;

      conn.query(`
        INSERT INTO tb_contacts (name, email, message) 
        VALUES(?, ?, ?)
      `, [
        f.name,
        f.email,
        f.message,
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