const conn = require('./../inc/db');
var express = require('express');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results => {
    res.render('index', { 
      title: 'Restaurante Saboroso!',
      menus: results,
      isHome: true
    });
  });
});

router.get('/contact', function(req, res, next){
  
  contacts.render(req, res);

});
router.post('/contact', function(req, res, next){
  if (!req.body.name){
    contacts.render(req, res, 'Digite o nome.');

  } else if (!req.body.email){
    contacts.render(req, res, 'Digite o e-email.');

  } else if (!req.body.message){
    contacts.render(req, res, 'Escreva uma mensagem para nós.');

  } else {

    contacts.save(req.body).then(results =>{

        req.body = {};
        contacts.render(req, res, null, 'Contato enviado! 😄');
    
      }).catch(err =>{
        contacts.render(req, res, err.message);
    });
  }
});

router.get('/menu', function(req, res, next){
  
  menus.getMenus().then(results => {
    res.render('menu', { 
      title: 'Menu - Restaurante Saboroso!',
      menus: results,
      background: 'images/img_bg_1.jpg',
      h1: 'Saboreie nosso menu!'
    });
  });
});

router.get('/reservation', function(req, res, next){

  reservations.render(req, res);
});
router.post('/reservation', function(req, res, next){

  if (!req.body.name){
    reservations.render(req, res, 'Digite o nome.');

  } else if (!req.body.email){
    reservations.render(req, res, 'Digite o e-email.');

  } else if (!req.body.people){
    reservations.render(req, res, 'Selecione o número de pessoas.');

  } else if (!req.body.date){
    reservations.render(req, res, 'Selecione a data.');

  }else if (!req.body.time){
    reservations.render(req, res, 'Selecione o horário.');

  } else {

      reservations.save(req.body).then(results =>{

        req.body = {};
        reservations.render(req, res, null, 'Reserva realizada com êxito. Esperamos você aqui! 😄');
    
      }).catch(err =>{
      reservations.render(req, res, err.message);
    });
  }
});

router.get('/services', function(req, res, next){
  res.render('services', {
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
  });
});

router.post('/subscribe', function(req, res, next){

  emails.save(req).then(results => {

    res.send(results);

  }).catch(err => {
    res.send(err);
  });
});

module.exports = router;
