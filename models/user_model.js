var db = require('../helpers/database');
var MD5 = require('MD5');
var fs = require('fs');
//var mysql_1 = global.mysql;

exports.admin_verify = function(user,cb) {
	db.getConnection(function(err, connection){	
		//str_query = "SELECT * FROM `users` WHERE `type`='admin' AND (`name` ="+mysql_1.escape(user.name)+" OR email="+mysql_1.escape(user.name)+") AND `password`  =MD5(MD5("+mysql_1.escape(user.password)+"))";
		str_query = "SELECT * FROM `users` WHERE `type`='admin' AND is_active=1 AND (`name` ='"+user.name+"' OR email='"+user.name+"') AND `password`  =MD5(MD5('"+user.password+"'))";
		
        connection.query(str_query , function(err, result) {
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
			cb(null, result);
			}
			else
			{cb(null, {});}
		  	connection.release();
		});
	});
}
exports.user_verify = function(user,cb) {
	db.getConnection(function(err, connection){	
		
		str_query = "SELECT users.*,(SELECT COUNT(property_id) FROM wishlist WHERE user_id = users.id) AS my_fav FROM `users` WHERE is_active=1 AND (`name` ='"+user.name+"' OR email='"+user.name+"') AND `password`  =MD5(MD5('"+user.password+"'))";
		
        connection.query(str_query , function(err, result) {
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
			cb(null, result);
			}
			else
			{cb(null, {});}
		  	connection.release();
		});
	});
}
exports.resetpassword = function(email,cb) {
	db.getConnection(function(err, connection){	
		
		str_query = "SELECT * FROM `users` WHERE email='"+email+"'";
		
        connection.query(str_query , function(err, result) {
        	var data = [];
			if (err) {
				connection.release();
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
				var mysecret = MD5(result[0].id+result[0].password);
				//console.log(mysecret);
				var mystring = connection.query("UPDATE users SET `password` =MD5(MD5('"+mysecret+"')) WHERE id="+result[0].id+" AND email='"+email+"'" , function(err, result2) {
				
				connection.release();
				cb(null, mysecret);
				});
			//console.log(mystring.sql);
			}
			else
			{cb("Invalid Email", {});}
		  	
		});
	});
}
exports.validate_oldpwd = function(user,cb) {
	db.getConnection(function(err, connection){	
		str_query = "SELECT * FROM `users` WHERE is_active=1 AND `id` ='"+user.id+"' AND `password`  =MD5(MD5('"+user.password+"'))";
		
        connection.query(str_query , function(err, result) {
		connection.release();
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
			cb(null, result);
			}
			else
			{cb(null, {});}
		  	
		});
	});
}
exports.check_exist = function(user,cb) {
	db.getConnection(function(err, connection){	
		var str_query = "";
		if(user.frontreg)
		{
			str_query = "SELECT * FROM `users` WHERE `email`='"+user.email+"'";
			
		}
		else
		{
			str_query = "SELECT * FROM `users` WHERE `"+user.control_name+"` ='"+user.control_value+"'";
			if(user.user_val)
			{
				str_query +=" AND id!='"+user.user_val+"'";
			}
		}
        connection.query(str_query , function(err, result) {
			connection.release();
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
			cb(null, "exist");
			}
			else
			{cb(null, "not_exist");}
		  	
		});
	});
}
exports.user_detail = function(user_id,cb) {
	db.getConnection(function(err, connection){	
	str_query = "SELECT users.*,agency.license_no,agency.agency_name FROM users LEFT JOIN agency ON users.agency_id = agency.id WHERE users.id='"+user_id+"'";
		
        connection.query(str_query , function(err, result) {
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
				cb(null, result);
			}
			else
			{cb(null, {});}
		  	connection.release();
		});
	});
}

exports.agency_list = function(cb) {
	db.getConnection(function(err, connection){	
	str_query = "SELECT * FROM `agency` ";
		
        connection.query(str_query , function(err, result) {
        	var data = [];
			if (err) {
				cb(err, {});
				return;
		  	}
			
			if(result.length>0)
			{
			cb(null, result);
			}
			else
			{cb(null, {});}
		  	connection.release();
		});
	});
}
exports.delete_user = function(user_id,cb)
{
	db.getConnection(function(err, connection){
       var myquery =  connection.query("DELETE FROM `users` WHERE id='"+user_id+"'", function(err, result) {
		connection.release();
		  if (err) {
				cb(err, null);
				return;
		  	}
		  cb(null, result);
		  
		});
		//console.log(myquery.sql);
	});
}

exports.save_user = function(user,cb) {
//console.log(user);
var binary_img = "";
var save_from = "";
var affected_userid = "";
var verify_token = '';
if(user['confirm'])
{
	verify_token = user['confirm'];
}
if(user['binary_img'])
{
	binary_img = user['binary_img'];
	binary_img = binary_img.substr(binary_img.indexOf(',')+1);
	binary_img = binary_img.replace(/ /g, '+');
	
}
if(user['save_from'])
{
	save_from = user['save_from'];
	
}
if(user['byear'])
{
	user['dob'] = user['byear'];
}
else
{
	if(!user['save_for'])
	user['dob'] = null;
}
if(user['type'])
{
	if(user['type'] != "agent")
	{
		user['agency_id'] = null;
		user['job_title'] = null;
		user['sales_no'] = null;
	}
}
var query_string = "";
if(user['password'])
{
	user['password'] = MD5(MD5(user['password']));
	if(verify_token)
	{
		verify_token  = user['password'];
	}
}
if(user['hidval'])
{
	affected_userid = user['hidval'];
	query_string = "UPDATE `users` SET ? WHERE id='"+user['hidval']+"'";
}
else
{
	//user['reg_date'] = NOW();
	query_string = "INSERT INTO `users` SET ?";
}
if (user.hasOwnProperty("is_active")) {
    user['is_active'] = "1";
}
else
{
	user['is_active'] = "0";
}
delete user['confirmpassword'];
delete user['hidval'];
delete user['binary_img'];
//delete user['bday'];
//delete user['bmonth'];
delete user['byear'];
delete user['confirm'];
delete user['frontreg'];
delete user['currentpassword'];
delete user['save_for'];
delete user['save_from'];
delete user['agency_name'];
delete user['agencyname'];
delete user['license_no'];
for(var k in user)
{
	if(user[k] == "")
	{
		delete user[k];
	}
}

db.getConnection(function(err, connection){
       var myquery =  connection.query(query_string, user, function(err, result) {
		
		  if (err) {
				cb(err, null);
				return;
		  	}
			//do img upload to folder
			if(!affected_userid)
			{
				
				affected_userid = result.insertId;
				if(binary_img == "" && save_from =="" )
				{
					fs.createReadStream('public/upload/users/profile-pic.jpg').pipe(fs.createWriteStream('public/upload/users/'+affected_userid+'.jpg'));
				}
				else{
				
				}
				fs.writeFile('public/upload/users/'+affected_userid+'.jpg', binary_img, 'base64', function(err) {
				
				if (err) {
					console.log(err);
				}
				else
				{
					connection.query("UPDATE `users` SET profile_image='"+affected_userid+".jpg' WHERE id='"+affected_userid+"'", function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
			}
			else
			{
				if(binary_img != "")
				{
					fs.writeFile('public/upload/users/'+affected_userid+'.jpg', binary_img, 'base64', function(err) {
				
						if (err) {
							console.log(err);
						}
						else
						{
							connection.query("UPDATE `users` SET profile_image='"+affected_userid+".jpg' WHERE id='"+affected_userid+"'", function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						}
					});
				}
				
			}
			if(verify_token)
			{
				result.token = verify_token;
			}
			
			connection.release();
			//
		  cb(null, result);
		  
		});
		//console.log(myquery.sql);
	});
/*user.password = MD5(MD5(user.password));
	db.getConnection(function(err, connection){
        connection.query('INSERT INTO `users` SET ?', user, function(err, result) {
		  if (err) {
				cb(err, null);
				return;
		  	}
		  cb(null, result);
		  connection.release();
		});
	});

 */
}
exports.filter_user = function(user,cb) {
//user.password = MD5(MD5(user.password));
	var querystring = user.query_str;
//start
	var aColumns = ["users.id","users.name", "email", "type", "agency_name","users.is_active"];
	
	/* Indexed column (used for fast and accurate table cardinality) */
	var sIndexColumn = "users.id";
		
	/* DB table to use */
	var sTable = "users";
	var sTable1 = "agency";
	
	/* 
	 * Paging
	 */
	var sLimit = "";
	if (querystring.iDisplayStart != 'null' && querystring.iDisplayLength != '-1' )
	{
		sLimit = "LIMIT "+querystring.iDisplayStart  +", "+
			querystring.iDisplayLength ;
	}
		/*
	 * Ordering
	 */
	 //console.log(querystring);
		if (querystring.iSortCol_0 != 'null' )
		{
			var sOrder = "ORDER BY  ";
			
			for ( var i=0 ; i< parseInt(querystring.iSortingCols) ; i++ )
			{
				//var sort_col = "iSortCol"+"_"+i;
				//console.log(sort_col);
				//var sort_val = querystring[sort_col];
				//console.log("is this work"+sort_val);
				if ( querystring["bSortable_"+parseInt(querystring["iSortCol_"+i])] == "true" )
				{
					sOrder += aColumns[ parseInt(querystring["iSortCol_" +i])+1 ]+" "+querystring["sSortDir_"+i]  +" , ";
				}
			}
			
			//sOrder = substr_replace( sOrder, "", -2 );
			sOrder = sOrder.substring(0, sOrder.length-2);
			if ( sOrder == "ORDER BY" )
			{
				sOrder = "";
			}
		}
		/* 
	 * Filtering
	 * NOTE this does not match the built-in DataTables filtering which does it
	 * word by word on any field. It's possible to do here, but concerned about efficiency
	 * on very large tables, and MySQL's regex functionality is very limited
	 */
//	 echo 'ok';exit();
	var sWhere = " WHERE 1=1 ";
	if(querystring.user_type != "" && querystring.user_type != "null")
	{
		 sWhere += " AND users.type='"+querystring.user_type+"' ";
	}
	if(querystring.status != "" && querystring.status != "null")
	{
		 sWhere += " AND users.is_active='"+querystring.status+"' ";
	}
	if (querystring.keyword != "" && querystring.keyword != "null" )
	{
		sWhere += " AND (";
		for ( var i=0 ; i<aColumns.length ; i++ )
		{
			sWhere += aColumns[i]+" LIKE '%"+querystring.keyword+"%' OR ";
		}
		//$sWhere = substr_replace( $sWhere, "", -3 );
		sWhere = sWhere.substring(0, sWhere.length-3);
		sWhere += ')';
	}
	
	/* Individual column filtering 
	for ( var i=0 ; i<count($aColumns) ; i++ )
	{
		if ( querystring.bSearchable_'.$i) == "true" && $this->input->get('sSearch_'.$i) != '' )
		{
			if ( $sWhere == "" )
			{
				$sWhere = "WHERE ";
			}
			else
			{
				$sWhere .= " AND ";
			}
			$sWhere .= $aColumns[$i]." LIKE '%".$this->db->escape_like_str($this->input->get('sSearch_'.$i))."%' ";
		}
	}
	*/
	
	/*
	 * SQL queries
	 * Get data to display
	 */
	 
	sQuery = "SELECT SQL_CALC_FOUND_ROWS "+aColumns.join()+" FROM "+sTable+" LEFT JOIN "+sTable1 +" ON "+ sTable+".agency_id="+sTable1+".id "+ sWhere+ sOrder+ sLimit;
	
	//console.log(sQuery);
	//cb(null, sQuery);
	
	db.getConnection(function(err, connection){
	
        connection.query(sQuery , function(err, results) {
			if (err) {
				console.log(err.code);
				cb(err, null);
				//return;
		  	}
			connection.query("SELECT FOUND_ROWS() as num_row" , function(err, myres) {
				if (err) {
					
					cb(err, null);
					//return;
				}
				var iFilteredTotal = myres[0].num_row;
				
				var rResult = results;
				var total_query = "SELECT COUNT("+sIndexColumn+") as total_record FROM "+sTable;
				connection.query(total_query, function(err, result) {
				if (err) {
					cb(err, null);
					//return;
			  	}
				
			  	connection.release();
			  	var iTotal = result[0].total_record;
				var output = {};
				output["sEcho"] = querystring.sEcho;
				output["iTotalRecords"] = iTotal;
				output["iTotalDisplayRecords"] = iFilteredTotal;
				output["aaData"] = [];
				var count = 0;
				for (var k in rResult) 
				//for(var i=0;i<rResult.length;i++)
				{
					/*var row = [];
					for ( var i=0 ; i<aColumns.length ;i++ )
					{
						
					}*/
					output['aaData'][count] =[rResult[k].name,rResult[k].email,rResult[k].type,rResult[k].agency_name,rResult[k].is_active,rResult[k].id];
					//output['aaData'][count] =rResult[k].name;
					count++;
				}
				//console.log(output);
				var json_data = JSON.stringify(output);
				//console.log(json_data);
				cb(null, json_data);	
				
			});
						
			});
		});
			
	});
	//$rResult = $this->db->query($sQuery) ;
	
	
	/*
	 * Output
	 */
	
	
//end
	

 
}
