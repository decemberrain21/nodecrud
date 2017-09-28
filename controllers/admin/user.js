var express = require('express');
var router = express.Router();
var user_model = require('../../models/user_model');

router.get('/verify', function(req, res) {
	res.redirect('/admin/login');
});

router.post('/verify', function(req, res) {
	//console.log("Passed from auth for verify");
	var user ={name:req.body.Username,password:req.body.Password};
	user_model.admin_verify(user, function(err, data) { 
	
	if(!err && data.length > 0)
	{
		//console.log(data.length);
		session = req.session;
		session.user = {};
		session.user.id = data[0].id;
		session.user.name = data[0].name;
		session.user.profile_image = data[0].profile_image;
		res.redirect('/admin');
	}
	else
	{
		res.render('admin/login', {error: "Invalid user name or password!"});
	}
 
	 });
	/*if(req.body.Username == "metro" && req.body.Password == "metropass" )
	{
		session = req.session;
		session.user = {};
		session.user.name = "Metro";
		res.redirect('/admin');
	}
	else
	{
		res.render('admin/login', {error: "Invalid user name or password!"});
	}*/
});
router.get('/delete/*', function(req, res) {
	req.originalUrl = req.originalUrl.split("?").shift();
	var params = req.originalUrl.split('/');
	var user_id = params[4];
	user_model.delete_user(user_id, function(err, data) { 
	
	if(err)
	{
		res.json({code: 1,error: "Error Deleting User"});
	}
	else
	{
		res.json({code: 0,msg: "Deleted"});
	}
		
	});
});

// change these lines to js code

module.exports = router;