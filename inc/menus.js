let conn = require('./db');
let path = require('path');

module.exports = {

  getMenus(){

    return new Promise((resolve, reject) => {
      
      conn.query(`SELECT * FROM tb_menus ORDER BY title
      `, (err, results) =>{
        if(err){
          reject(err);

        } else {
          resolve(results);
        }
      });
    });
  },

  save(fields, files){

    return new Promise((resolve, reject) =>{

      fields.photo = `images/${path.parse(files.photo.path).base}`;

      let f = fields;

      conn.query(`
        INSERT INTO tb_menus (title, description, price, photo) 
        VALUES (?, ?, ?, ?)
      `, [
        f.title,
        f.description,
        f.price,
        f.photo
      ], (err, results)=>{
        if (err){
          reject(err);
          
        } else {
          resolve(results);
        }
      });
    
    });
  }

}