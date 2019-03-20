var express = require('express');
var router = express.Router();
var Creche = require('../models/creche');

/* GET add new Creche page. */
router.get('/newCreche', function(req, res, next) {
    res.render('CrecheSetup', { title: 'New Creche' });
});

/* GET add landing  page. */
router.get('/home', function(req, res, next) {
    res.render('CrecheHome', { title: 'Creche Home' });
});

router.post('/newcreche', function(req, res, next){
    var name = req.body.creche_name;
    var email = req.body.creche_email; 
    var a1 = req.body.creche_a1;
    var a2 = req.body.creche_a2; 
    var a3 = req.body.creche_a3;
    var a4 = req.body.creche_a4; 
    var newcreche = new Creche ();
    // set the childs local credentials
    newcreche.name = name;
    newcreche.email = email;   
    newcreche.street = a1;  
    newcreche.town= a2;  
    newcreche.country= a3;  
    newcreche.postcode= a4;  
    newcreche.save(function(err, creche) {
        if (err)
            throw err;
        res.json({'success' : 'Creche Registered created'});
    });
});

module.exports = router;