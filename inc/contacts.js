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

  getContacts(){

    return new Promise((resolve, reject) => {
      
      conn.query(`SELECT * FROM tb_contacts ORDER BY name
      `, (err, results) =>{
        if(err){
          reject(err);
        }
        resolve(results);
      });
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
  },

  delete(id){

    return new Promise((resolve, reject)=>{

      conn.query(`
        DELETE FROM tb_contacts WHERE id = ?
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