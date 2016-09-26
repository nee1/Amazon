/*
-------Created by Darshil Saraiya 4/22/16-------
-------Admin related operations-------
*/

//Required Files
var mq = require('../rpc/client');
var Admin = require('./model/admin');

//admin login page
exports.login = function(req, res) {

  Admin.find(function(err,data){

    if(data.length <= 0){
      adminData = new Admin();
      adminData.fname = "demo";
      adminData.lname = "demo";
      adminData.email = "demo@demo.demo";
      adminData.pass = "demo";
      adminData.save(function(err){
        res.render('admin-login');
      })
    }else{
      if(req.session.email)
          res.redirect('admin/home');
      else
        res.render('admin-login');
    }
  });

}

exports.profile = function(req, res) {
  if(req.session.email) {
    res.render('admin-profile', {
      email : req.session.email, 
      fname : req.session.fname, 
      lname : req.session.lname, 
      createdAt : req.session.createdAt
    });
  }
  else
  {
    res.redirect('/admin/login');
  }
}

exports.getAdminProfile = function(req, res) {

    if(req.session.email) {
      //messege payload for sending to server
      msg_payload = {"service" : "getAdminProfile", "email" : req.session.email};

      //making request to the server
      mq.make_request('admin-queue', msg_payload,function(err, results) {
        if(err) {
          console.log("Error occurred while requesting to server for getAdminProfile : " + err);
          var json_resposes = {"status" : 401, "error" : "Could not connect to server"};
          res.send(json_resposes);
        } else {
            res.send(JSON.parse(results));
        }
      });
    } else
      res.redirect('/admin/login');
}

exports.saveAdminProfile = function(req, res) {

  var a_id = req.param("a_id");
  var fname = req.param("fname");
  var lname = req.param("lname");
  var email = req.param("email");
  var pass = req.param("pass");
  var address = req.param("address");
  var city = req.param("city");
  var state = req.param("state");
  var zipCode = req.param("zipCode");

  if(req.session.email) {
    //messege payload for sending to server
      msg_payload = {
        "service" : "saveAdminProfile", 
        "a_id" : a_id,
        "fname" : fname,
        "lname" : lname,
        "email" : email,
        "pass" : pass,
        "address" : address,
        "city" : city,
        "state" : state,
        "zipCode" : zipCode
      };

      //making request to the server
      mq.make_request('admin-queue', msg_payload,function(err, results) {
        if(err) {
          console.log("Error occurred while requesting to server for saveAdminProfile : " + err);
          var json_resposes = {"status" : 401, "error" : "Could not connect to server"};
          res.send(json_resposes);
        } else {
          
          var dataParsed = JSON.parse(results);
          if(dataParsed.status == 200) {
            req.session.email = email;
            req.session.fname = fname;
            req.session.lname = lname;
            res.send(JSON.parse(results));
          } else if(dataParsed.status == 401) {
            res.send(JSON.parse(results));
          }
        }
      });
  } else 
    res.redirect('/admin/login');
}

exports.logout = function(req, res) {
	console.log("admin logout");
  req.session.destroy();
	res.redirect("/admin/login");
}

//admin checking the login
exports.checkLogin = function(req, res) {

	//email password as parameters
	var email = req.param("email");
	var pass = req.param("pass");

	if(email != '' && pass != '') {
		//messege payload for sending to server
		msg_payload = {"service" : "checkLogin", "email" : email, "pass" : pass};

		//making request to the server
		mq.make_request('admin-queue', msg_payload,function(err, results) {
			if(err) {
				console.log("Error occurred while requesting to server for checkLogin : " + err);
				var json_resposes = {"statusCode" : 401, "error" : "Could not connect to server"};
				res.send(json_resposes);
			} else {
				var dataParsed = JSON.parse(results);
				if(dataParsed.statusCode == 200) {
					req.session.email = email;
					req.session.fname = dataParsed.fname;
					req.session.lname = dataParsed.lname;
					req.session.createdAt = dataParsed.createdAt;
					res.send(JSON.parse(results));
				} else if(dataParsed.statusCode == 401) {
					res.send(JSON.parse(results));
				}
			}
		});
	} else {
		var json_resposes = {"statusCode" : 401, "error" : "Invalid Login Credentials!"};
		res.send(json_resposes);
	}
}

//admin home page
exports.home = function(req, res){
  if(req.session.email) {
  	//Set these headers to notify the browser not to maintain any cache for the page being loaded
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('admin-index', {
  	 email : req.session.email, 
  	 fname : req.session.fname, 
  	 lname : req.session.lname, 
  	 createdAt : req.session.createdAt
    });
  }
  else {
  	res.redirect('/admin/login');
  }
};

//farmers list page
exports.farmersList = function(req, res){
  if(req.session.email) {
  	res.render('farmers-list', {
  		email : req.session.email, 
  		fname : req.session.fname, 
  		lname : req.session.lname, 
  		createdAt : req.session.createdAt
  	});
  }
  else
  {
  	res.redirect('/admin/login');
  }
};

//products list page
exports.productsList = function(req,res){
	if(req.session.email) {
		res.render('products-list', {
  		email : req.session.email, 
  		fname : req.session.fname, 
  		lname : req.session.lname, 
  		createdAt : req.session.createdAt
  	});
  }
	else{
  	res.redirect('/admin/login');
  }
};

//trucks list page
exports.trucksList = function(req,res){
  if(req.session.email) { 
    res.render('trucks-list', {
  		email : req.session.email, 
  		fname : req.session.fname, 
  		lname : req.session.lname, 
  		createdAt : req.session.createdAt
  	});
  }
  else{
    res.redirect('/admin/login');
  }
};

//drivers list page
exports.driversList = function(req,res){
  if(req.session.email) {
    res.render('drivers-list', {
  		email : req.session.email, 
  		fname : req.session.fname, 
  		lname : req.session.lname, 
  		createdAt : req.session.createdAt
  	});
  } else
    res.redirect('/admin/login');
};

//customers list page
exports.customersList = function(req,res){
  if(req.session.email){
    res.render('customers-list', {
      email : req.session.email, 
  		fname : req.session.fname, 
  		lname : req.session.lname, 
  		createdAt : req.session.createdAt
      });
  } else{
    res.redirect('/admin/login');
  }
};

//orders list page
exports.ordersList = function(req,res){
  if(req.session.email) {
    res.render('orders-list', {
  		email : req.session.email, 
  		fname : req.session.fname, 
  		lname : req.session.lname, 
  		createdAt : req.session.createdAt
  	});
  } else{
    res.redirect('/admin/login');
  }
};
