var express = require('express');
var router = express.Router();

router.use(require('../middlewares/auth'));

console.log("Request Start");

// Backend Control System
router.get('/admin', function(req, res) {

	//var settings = {};
	//settings.user = req.session.user;
	
	//console.log(settings);
  	//res.render('admin/index', {session: req.session});
	res.redirect("/admin/property/list");
});

router.get('/admin/login', function(req, res) {

  res.render('admin/login');
});

router.get('/admin/logout', function(req, res) {
/*
req.session.login = null;
// this also works
delete req.session.login;
The function destroy() is for removing the entire session.
*/
delete req.session.user;
res.redirect('/admin/login');
  /*req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/admin/login');
		}
	});*/
});

router.use('/admin/user', require('./admin/user'));
router.use('/admin/property', require('./admin/property'));
router.use('/admin/cms', require('./admin/cms'));
router.use('/admin/agency', require('./admin/agency'));
router.use('/admin/settings', require('./admin/settings'));
router.use('/admin/payment', require('./admin/payment'));
//router.use('/admin/booking', require('./admin/booking'));
//router.use('/admin/admin_user', require('./admin/admin_user'));

// Front-End system

router.use('/', require('./home'));
//router.use('/*', require("./content"));
router.use('/user', require('./user'));
router.use('/myaccount', require('./myaccount'));
router.get('/logout', function(req, res) {
req.session.cookie.maxAge = 1000;
delete req.session.frontuser;
res.redirect('/');
 
});

//router.use('/*', require("./content"));




module.exports = router;