var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var Child = require('../models/child');

/* GET child list page. */
router.get('/children', function(req, res, next) {
  res.render('childList', { title: 'Children' });
});

/* GET add child page. */
router.get('/addChild', function(req, res, next) {
  res.render('addChild', { title: 'New Child' });
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addchild', function(req, res, next){
    try {
        var userJwtString = req.cookies.Authorization.split(" ");
        var profile = verifyJwt(userJwtString[1]);
        
        console.log(req.body);
        // Create new child object
        var newchild = new Child();

        // If the logged in user is a parent, set its par_id
        if (profile) {
            if(profile.user_id){
                var userid = profile.user_id;
                newchild.par_id = userid;
            } else if(profile.emp_id){
                var crecheJwtString = req.cookies.Authorization_Creche.split(" ");
                var creche = verifyJwt(crecheJwtString[1]);
                newchild.par_id = req.body.parId;
                // Set creche
                var crecheid = creche.creche_id;
                newchild.creche_id = crecheid;
            }
            
            var childfname = req.body.child_fname;
            var childlname = req.body.child_lname;
            var Dob = req.body.dob;

            // Set the childs local credentials
            newchild.child_fname = childfname;
            newchild.child_lname = childlname;   
            newchild.dob = Dob;

            

            // Save child to database
            newchild.save(function(err, child) {
                if (err)
                    throw err;
                res.json({'success' : 'Child created'});
            });
        }
    } catch (err) {
        console.log(err);
            res.json({
                "status": "error",
                "body": [
                    "You are not logged in."
                ]
            });
        }
});
// will get every child in the database will have to change this to prevent this from happning 
router.get('/getchild'
           , function(req, res, next)
           {
    Child.find({userid:req.query.userid}, function (err,child_fname) {
        if (err)
            res.send(err);
        res.json(child_fname);
    });
});

// Return all children given parent id (json request)
router.post('/getChildren', function(req, res, next){
    try {
        var userJwtString = req.cookies.Authorization.split(" ");
        var profile = verifyJwt(userJwtString[1])
        
        if (profile) {
            if(profile.user_id){
                var userid = profile.user_id;
                Child.find({par_id:userid}, function (err,child_fname) {
                    if (err)
                        res.send(err);
                        res.json(child_fname);
                });
            } else if(profile.emp_id){
                console.log(req.cookies);
                // var crecheJwtString = req.cookies.Authorization_Creche.split(" ");
                // var creche = verifyJwt(crecheJwtString[1]);
                // var crecheid = creche.creche_id;
                // Child.find({creche_id:crecheid}, function (err,child_fname) {
                //     if (err)
                //         res.send(err);
                //         res.json(child_fname);
                // });
            }
        }
    } catch (err) {
        console.log(err);
            res.json({
                "status": "error",
                "body": [
                    "You are not logged in."
                ]
            });
        }

});

// NOT CHANGED TO JWT YET - UNTIL ADDING DELETE CHILD BUTTON
// deleate the Child Request need to pass in the id of the child to be deleated
router.delete('/delchild/:id', function(req, res ,next){
    var id = req.params.id; 
    Child.remove({_id:id}, function(err, child_fname){ /*Deleates the Comment by Id*/
        if(err)
            res.send(err);
        res.json(child_fname); /* Returns the list of comments */
    });
});

function verifyJwt(jwtString) {
    var value = jwt.verify(jwtString, 'CSIsTheWorst');
    return value;
}

module.exports = router;