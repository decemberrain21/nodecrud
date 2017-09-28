var express = require('express');
var router = express.Router();
var fs = require('fs');
//var Jimp = require('jimp');
//var im = require('imagemagick');
var images = require("images");
//var easyimg = require('easyimage');
//var gm = require('gm');
//var im = require('imagemagick-composite');
var rmdir = require('rmdir');
var property_model = require('../models/property_model');
var user_model = require('../models/user_model');
var setting_model = require('../models/settings_model');
var numberWithCommas = function (x) {
	if(x)
	{
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	else
	{
		return x;
	}
};
router.get('/agency',function(req,res){
	res.redirect('/myaccount/profile#myagent');
});
router.get('/password',function(req,res){
	res.redirect('/myaccount/profile#mypassword');
});

router.post('/save_profile',function(req, res){
	req.body.is_active  = 1;
	var savedata = function(){
	req.body.hidval = req.session.frontuser.id;
	req.body.save_from = "user_profile";
		user_model.save_user(req.body, function(err, data) { 
			if(err)
			{
				res.json({code: 1,error: "Error Saving Profile"});
			}
			else
			{
				res.json({code: 0,msg: "Changes Saved"});
			}
		});
	};
	if(req.body.save_for == "profile")
	{
		if(req.session.frontuser.type != "agent")
		{
			if(!req.body.name || !req.body.email ||!req.body.phone)
			{
				return res.json({code: 1,error: "Please fill all * fields !"});
			}
			/*if(req.session.frontuser.type == "homeowner")
			{
				if(!req.body.address || !req.body.postal_code)
				{
					return res.json({code: 1,error: "Please fill all * fields !"});
				}
			}
			*/
			savedata();
		}
		else
		{
			if(!req.body.sales_no || ! req.body.agency_name)
			{
				return res.json({code: 1,error: "Please fill all * fields !"});
			}
			//if(req.body.agency_id == "other")
			//{
				if(!req.body.agency_name || ! req.body.license_no)
				{
					return res.json({code: 1,error: "Please fill all * fields !"});
				}
				var agency_data = {};
				agency_data['agency_name'] = req.body.agency_name;
				agency_data['license_no'] = req.body.license_no;
				agency_data['user_id'] = req.body.hidval;
				user_model.update_agency(agency_data, function(err, data) {
				if(!err)//  && data.insertId != "0"
				{
					//req.body.agency_id = data.insertId;
					savedata();
				}
				else
				{
					return res.json({code: 1,error: "Error Saving Agency!"});
					
				}
				});
			/*}
			else{
			savedata();
			}*/
		}
	}
	else if(req.body.save_for == "password")
	{
		
		if(!req.body.password || !req.body.confirmpassword || !req.body.currentpassword)
		{
			return res.json({code: 1,error: "Please fill all * fields !"});
		}
		else
		{
			//check current password is valid
			var user_data={};
			user_data['id'] = req.session.frontuser.id; 
			user_data['password'] = req.body.currentpassword ;
			user_model.validate_oldpwd(user_data, function(err, data) {
			if(!err && data.length > 0)
			{
				savedata();
			}
			else
			{
				return res.json({code: 1,error: "Invalid Current Password!"});
				
			}
			});
		}
		if(req.body.password != req.body.confirmpassword)
		{
			return res.json({code: 1,error: "New Password and Confirm Password must be same !"});
		}
	}
});

module.exports = router;