var API = {

    init: function(a,s,d){

        this.app = a;
        this.server = s;
        this.database = d;

        this.path = require('path');
        this.bodyParser = require('body-parser');
        this.https = require('https');
        this.nodemailer = require('nodemailer');
        this.emailer = this.nodemailer.createTransport({ service: 'Gmail', auth: { user: 'JoinUs@piggybacknwa.com', pass: 'harvardnwa1' } });
        this.crypto = require('crypto');

        // best way to get the "body" from POST requests
        // postman testing
        this.app.use(this.bodyParser.urlencoded({ extended: false, type:"urlencoded" }));
        //app connection
        //this.app.use(this.bodyParser.json());

        // used for general file routing
        this.rootDir = this.path.dirname(require.main.filename);

        if (this.app && this.server && this.database)
            console.log("API Initialized");
        else
            console.log("Failure: API Initialization");
    },
    start: function() {
        // login
        API.app.all('/login(/)?', function(req,res) {
            if (req.method == "POST") {
                API.login(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // user signup
        API.app.all('/signup/user(/)?', function(req,res){
            if (req.method == "POST") {
                API.signup_user(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // member signup
        API.app.all('/signup/membership(/)?', function(req,res){
            if (req.method == "POST") {
                API.signup_member(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // member pluss signup
        API.app.all('/signup/membership/plus(/)?', function(req,res){
            if (req.method == "POST") {
                API.signup_member_plus(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // driver signup
        API.app.all('/signup/driver(/)?', function(req,res){
            if (req.method == "POST") {
                API.signup_driver(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });

        // get user coupons
        API.app.all('/user/coupons(/)?', function(req,res) {
            if (req.method == "GET") {
                API.user_coupons(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // get coupons
        API.app.all('/coupons(/)?', function(req,res) {
            if (req.method == "GET") {
                API.coupons(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // get user
        API.app.all('/user(/)?', function(req,res) {
            if (req.method == "GET") {
                API.user(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // generate reset code
        API.app.all('/reset(/)?', function(req,res){
            if (req.method == "POST") {
                API.reset_password(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // update password
        API.app.all('/update-password(/)?', function(req,res){
            if (req.method == "POST") {
                API.update_password(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // coupon create
        API.app.all('/coupons/create(/)?', function(req,res){
            if (req.method == "POST") {
                API.coupon_create(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // coupon delete
        API.app.all('/coupons/delete(/)?', function(req,res){
            if (req.method == "POST") {
                API.coupon_delete(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // get rides
        API.app.all('/rides(/)?', function(req,res) {
            if (req.method == "GET") {
                API.rides(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // get user rides
        API.app.all('/user/rides(/)?', function(req,res) {
            if (req.method == "GET") {
                API.user_rides(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // get user membership status
        API.app.all('/user/status(/)?', function(req,res) {
            if (req.method == "GET") {
                API.user_status(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // get driver rides
        API.app.all('/driver/rides(/)?', function(req,res) {
            if (req.method == "GET") {
                API.driver_rides(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // booking a ride
        API.app.all('/rides/book(/)?', function(req,res) {
            if (req.method == "POST") {
                API.book_ride(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // claiming a ride
        API.app.all('/rides/claim(/)?', function(req,res) {
            if (req.method == "POST") {
                API.claim_ride(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // edit a ride
        API.app.all('/rides/edit(/)?', function(req,res) {
            if (req.method == "POST") {
                API.edit_ride(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // delete a ride
        API.app.all('/rides/delete(/)?', function(req,res) {
            if (req.method == "POST") {
                API.delete_ride(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // complete a ride
        API.app.all('/rides/complete(/)?', function(req,res) {
            if (req.method == "POST") {
                API.complete_ride(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });
        // get salt
        API.app.all('/salt(/)?', function(req,res) {
            if (req.method == "POST") {
                API.salt(req,res);
            }
            else {
                API.methodNotAllowed(req,res);
            }
        });

        // this handles generic file routing, and 404's the rest.
        API.app.get('/*(/)?',function(req,res){
            // disallow some things to be seen (.js files, most importantly)
            // SECURITY ISSUE!
            if (req.path.indexOf('node_modules') < 0) {
                var path;
                if (API.path.extname(req.path)) {
                    path = API.path.join(API.rootDir, req.path);
                }
                else {
                    path = API.path.join(API.rootDir, req.path, 'index.html');
                }
                res.sendFile(path, null, function(err){
                    if (err) {
                        API.notFound(req,res);
                    }
                });
            }
            else {
                API.notFound(req,res);
            }
        });
        // this needs to be the last app.all called (for 404 errors and bad requests)
        API.app.all('*', function(req, res){API.notFound(req,res);});


        console.log('API Started');
    },

    //API calls
    signup_user: function(req,res) {
        var response = { status: {code:"0",description:":)"} };
        //required items
        var first = req.body.first_name;
        var last = req.body.last_name;
        var nickname = req.body.nickname;
        var email = req.body.email;
        var password = req.body.password;
        if (password != null && email != null && first != null && last != null && nickname != null) {
            var salt = API.crypto.randomBytes(Math.ceil(16/2))
                .toString('hex')
                .slice(0,16);
            var hash = API.crypto.createHmac('sha512', salt);
            hash.update(password);
            var hashed_password = hash.digest('hex');
            API.database.add_user(first, last, nickname, hashed_password, salt, email,
            function(user) {
                if (user) {
                    response.user = {};
                    response.user.user_id = user._id;
                    API.login(req, res);
                }
                else {
                    response.status.code = "-22";
                    response.status.description = "Error Inserting Into the Database.";
                    API.sendResponse(req,res,response);
                }
            });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    login: function(req,res) {
        var response = { status: {code:"0",description:":)"} };
        if (req.body.email != null && req.body.password != null) {
            var password = req.body.password;
            var user = API.database.get_salt(req.body.email, function(user){
                if (user) {
                    //response.salt = user;
                    var salt = JSON.stringify(user);
                    salt = salt.replace("{","");
                    salt = salt.replace("}","");
                    salt = salt.replace(/"/g,'');
                    salt = salt.replace("salt:","");
                    var hash = API.crypto.createHmac('sha512', salt);
                    hash.update(password);
                    var hashed_password = hash.digest('hex');
                    API.database.check_user_credentials(req.body.email, hashed_password, function(user){
                      if (user) {
                          //success!
                          response.success = true;
                          response.user = user;
                          API.sendResponse(req,res,response);
                      }
                      else {
                          response.status.code = "-31";
                          response.status.description = "Invalid Credentials";
                          response.success = false;
                          API.sendResponse(req,res, response);
                      }
                    });
                }
                else {
                    API.badDataReceived(req,res);
                }
            });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    book_ride: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        //optional items
        var coupon_name = req.body.coupon_name;
        var coupon_desc = req.body.coupon_desc;

        //required items
        var rider_id = req.body.rider_id;
        var passengers = req.body.passengers;
        var charged_passengers = req.body.passengers;
        var pickup_street = req.body.pickup_street;
        var pickup_city = req.body.pickup_city;
        var pickup_state = req.body.pickup_state;
        var pickup_zip = req.body.pickup_zip;
        var pickup_lat = req.body.pickup_lat;
        var pickup_lng = req.body.pickup_lng;
        var dest_street = req.body.dest_street;
        var dest_city = req.body.dest_city;
        var dest_state = req.body.dest_state;
        var dest_zip = req.body.dest_zip;
        var dest_lat = req.body.dest_lat;
        var dest_lng = req.body.dest_lng;
        var cost;

        if (dest_lat != null && dest_lng != null && pickup_lng != null && pickup_lat != null && rider_id != null
            && passengers != null && pickup_street != null && pickup_city != null && pickup_state != null && pickup_zip != null
            && dest_street != null && dest_city != null && dest_state != null && dest_zip != null) {
            var membership = API.database.get_premium_status(rider_id, function(membership){
                if (membership == "member"){
                    charged_passengers = charged_passengers - 1;
                    switch (charged_passengers) {
                      case 0:
                        cost = 0;
                        break;
                      case 1:
                        cost = 500;
                        break;
                      case 2:
                        cost = 1000;
                        break;
                      case 3:
                        cost = 1000;
                        break;
                      case 4:
                        cost = 1000;
                        break;
                      case 5:
                        cost = 1000;
                        break;
                      case 6:
                        cost = 1500;
                        break;
                      case 7:
                        cost = 1500;
                        break;
                      case 8:
                        cost = 1500;
                        break;
                      case 9:
                        cost = 1500;
                        break;
                      case 10:
                        cost = 1500;
                        break;
                      default:
                        cost = 2000;
                        break;
                    }
                    API.database.add_ride(rider_id, passengers, cost, coupon_name, coupon_desc, pickup_street, pickup_city,
                                          pickup_state, pickup_zip, pickup_lat, pickup_lng, dest_street, dest_city, dest_state, dest_zip, dest_lat, dest_lng,
                    function(user) {
                        if (user) {
                            response.user = user;
                            API.sendResponse(req,res,response);
                        }
                        else {
                            response.status.code = "-22";
                            response.status.description = "Error Inserting Into the Database.";
                            API.sendResponse(req,res,response);
                        }
                    });
                }
                else if (membership == "plus") {
                    charged_passengers = charged_passengers - 2;
                    if (charged_passengers < 0){
                        charged_passengers = 0;
                    }
                    switch (charged_passengers) {
                      case 0:
                        cost = 0;
                        break;
                      case 1:
                        cost = 500;
                        break;
                      case 2:
                        cost = 1000;
                        break;
                      case 3:
                        cost = 1000;
                        break;
                      case 4:
                        cost = 1000;
                        break;
                      case 5:
                        cost = 1000;
                        break;
                      case 6:
                        cost = 1500;
                        break;
                      case 7:
                        cost = 1500;
                        break;
                      case 8:
                        cost = 1500;
                        break;
                      case 9:
                        cost = 1500;
                        break;
                      case 10:
                        cost = 1500;
                        break;
                      default:
                        cost = 2000;
                        break;
                    }
                    API.database.add_ride(rider_id, passengers, cost, coupon_name, coupon_desc, pickup_street, pickup_city,
                                          pickup_state, pickup_zip, pickup_lat, pickup_lng, dest_street, dest_city, dest_state, dest_zip, dest_lat, dest_lng,
                    function(user) {
                        if (user) {
                            response.user = user;
                            API.sendResponse(req,res,response);
                        }
                        else {
                            response.status.code = "-22";
                            response.status.description = "Error Inserting Into the Database.";
                            API.sendResponse(req,res,response);
                        }
                    });
                }
                else if (membership == "none") {
                    charged_passengers = charged_passengers;
                    switch (charged_passengers) {
                      case 0:
                        cost = 0;
                        break;
                      case 1:
                        cost = 500;
                        break;
                      case 2:
                        cost = 1000;
                        break;
                      case 3:
                        cost = 1000;
                        break;
                      case 4:
                        cost = 1000;
                        break;
                      case 5:
                        cost = 1000;
                        break;
                      case 6:
                        cost = 1500;
                        break;
                      case 7:
                        cost = 1500;
                        break;
                      case 8:
                        cost = 1500;
                        break;
                      case 9:
                        cost = 1500;
                        break;
                      case 10:
                        cost = 1500;
                        break;
                      default:
                        cost = 2000;
                        break;
                    }
                    API.database.add_ride(rider_id, passengers, cost, coupon_name, coupon_desc, pickup_street, pickup_city,
                                          pickup_state, pickup_zip, pickup_lat, pickup_lng, dest_street, dest_city, dest_state, dest_zip, dest_lat, dest_lng,
                    function(user) {
                        if (user) {
                            response.user = user;
                            API.sendResponse(req,res,response);
                        }
                        else {
                            response.status.code = "-22";
                            response.status.description = "Error Inserting Into the Database.";
                            API.sendResponse(req,res,response);
                        }
                    });
                }
            });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    edit_ride: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        //optional items
        var pickup_name = req.body.pickup_name;
        var dest_name = req.body.dest_name;

        //required items
        var ride_id = req.body.ride_id;
        var passengers = req.body.passengers;
        var pickup_street = req.body.pickup_street;
        var pickup_city = req.body.pickup_city;
        var pickup_state = req.body.pickup_state;
        var pickup_zip = req.body.pickup_zip;
        var dest_street = req.body.dest_street;
        var dest_city = req.body.dest_city;
        var dest_state = req.body.dest_state;
        var dest_zip = req.body.dest_zip;

        if (ride_id != null && passengers != null && pickup_street != null
            && pickup_city != null && pickup_state != null && pickup_zip != null
            && dest_street != null && dest_city != null && dest_state != null && dest_zip != null) {
            var success = API.database.edit_ride(ride_id, passengers, pickup_name, pickup_street, pickup_city,
                                  pickup_state, pickup_zip, dest_name, dest_street, dest_city, dest_state, dest_zip);
            if (success)
                API.sendResponse(req,res,response);
            else
                API.serverError(req,res,"error with database update");
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    claim_ride: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var ride_id = req.body.ride_id;
        var driver_id = req.body.driver_id;

        if (ride_id != null && driver_id != null) {
          API.database.claim_ride(ride_id, driver_id,
            function(ride) {
              if (ride) {
                  response.ride = {};
                  response.ride.ride_id = ride._id;
                  API.sendResponse(req,res,response);
              }
              else {
                  response.status.code = "-22";
                  response.status.description = "error with database insertion";
                  API.sendResponse(req,res,response);
              }
          });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    complete_ride: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        //test : sk_test_QzuQnHoUiBdE5kVOBROmvQvv
        //live : sk_live_m6sxm1ubheSMNRdms06aqv1q
        var stripe = require("stripe")(
          "sk_live_m6sxm1ubheSMNRdms06aqv1q"
        );

        var ride_id = req.body.ride_id;

        if (ride_id != null) {
            var cost = API.database.get_ride_cost(ride_id, function(cost){
              if (cost != undefined){
                var stripe_id = API.database.get_stripe(ride_id, function(stripe_id){
                  if (stripe_id != undefined){
                      stripe.charges.create({
                      amount: cost,
                      currency: "usd",
                      customer: stripe_id
                      }, function(err) {
                        if (err){
                          switch (err.type) {
                            case 'StripeCardError':
                              // Declined card error
                              response.status.code = -1;
                              response.status.description = err.message;
                              API.sendResponse(req,res,response);
                            break;
                            case 'RateLimitError':
                              // Too many requests made to the API too quickly
                              response.status.code = -2;
                              response.status.description = err.message;
                              API.sendResponse(req,res,response);
                            break;
                            case 'StripeInvalidRequestError':
                              // Invalid parameters were supplied to Stripe's API
                              response.status.code = -3;
                              response.status.description = err.message;
                              API.sendResponse(req,res,response);
                            break;
                            case 'StripeAPIError':
                              // An error occurred internally with Stripe's API
                              response.status.code = -4;
                              response.status.description = err.message;
                              API.sendResponse(req,res,response);
                            break;
                            case 'StripeConnectionError':
                              // Some kind of error occurred during the HTTPS communication
                              response.status.code = -5;
                              response.status.description = err.message;
                              API.sendResponse(req,res,response);
                            break;
                            case 'StripeAuthenticationError':
                              // You probably used an incorrect API key
                              response.status.code = -6;
                              response.status.description = err.message;
                              API.sendResponse(req,res,response);
                            break;
                            default:
                              // Handle any other types of unexpected errors
                              response.status.code = -7;
                              response.status.description = err.message;
                              API.sendResponse(req,res,response);
                            break;
                          }
                        }
                    });
                  }
                  else {
                      API.badDataReceived(req,res);
                  }
                  var success = API.database.complete_ride(ride_id);
                  if (success)
                      API.sendResponse(req,res,response);
                  else
                      API.serverError(req,res,"error with database update");
              });
              }
              else {
                  API.badDataReceived(req,res);
              }
            });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    delete_ride: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var ride_id = req.body.ride_id;

        if (ride_id != null) {
            API.database.delete_ride(ride_id,
              function(user) {
                if (user) {
                    response.user = {};
                    response.user.user_id = user._id;
                    API.sendResponse(req,res,response);
                }
                else {
                    response.status.code = "-22";
                    response.status.description = "Error Deleted From the Database.";
                    API.sendResponse(req,res,response);
                }
            });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    //gets all unclaimed rides
    rides: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var city = req.query.city;
        var state = req.query.state;

        if (city != null && state != null) {
          var rides = API.database.get_all_unclaimed_rides(city, state, function(rides){
              if (rides) {
                  response.rides = rides;
                  API.sendResponse(req,res,response);
              }
              else {
                  API.badDataReceived(req,res);
              }
          });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    //gets active rides of a user
    user_rides: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var user_id = req.query.user_id;

        if (user_id != null) {
          var rides = API.database.get_user_rides(user_id, function(rides){
              if (rides) {
                  response.rides = rides;
                  API.sendResponse(req,res,response);
              }
              else {
                  response.status = {code:"0",description:"empty"}
                  response.rides = [];
                  API.sendResponse(req,res,response);
              }
          });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    //gets active rides of a user
    user_status: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var user_id = req.query.user_id;

        if (user_id != null) {
          var membership = API.database.get_premium_status(user_id, function(membership){
            if (membership) {
                response.membership = membership;
                API.sendResponse(req,res,response);
            }
            else {
                response.status = {code:"0",description:"empty"}
                response.rides = [];
                API.sendResponse(req,res,response);
            }
          });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    //gets active rides of driver
    driver_rides: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var driver_id = req.query.driver_id;

        if (driver_id != null) {
          var rides = API.database.get_driver_rides(driver_id, function(rides){
              if (rides) {
                  response.rides = rides;
                  API.sendResponse(req,res,response);
              }
              else {
                  response.status = {code:"0",description:"empty"}
                  response.rides = [];
                  API.sendResponse(req,res,response);
              }
          });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    reset_password: function(req, res) {
        var response = { status: {code:"0",description:":)"} };

        var email = req.body.email;
        var user_type = req.body.user_type;

        if (email != null && user_type != null) {
            var salt = API.crypto.randomBytes(Math.ceil(16/2))
              .toString('hex')
              .slice(0,7);
            API.database.add_reset(email, user_type, salt,
              function(result) {
                if (result) {
                    var mailOptions = {
                      from: '"PiggyBack" <admin@piggyback.com>', // sender address
                      to: email, // list of receivers
                      subject: 'PiggyBack Password Reset', // Subject line
                      text: 'Password Reset Approved!/n/nReset Token: ' + salt + '/n/nEnter this to reset your password./n/nContact us with questions at 479-601-7242 or admin@piggyback.com', // plaintext body
                      html: 'Password Reset Approved!<br><br>Reset Token: ' + salt + '<br><br>Enter this to reset your password.<br><br>Contact us with questions at 479-601-7242 or admin@piggyback.com' // html body
                    };
                    API.emailer.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                    });
                    response.result = result;
                    API.sendResponse(req,res,response);
                }
                else {
                    response.status.code = "-22";
                    response.status.description = "Error Updating the Database.";
                    API.sendResponse(req,res,response);
                }
              });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    update_password: function(req, res) {
        var response = { status: {code:"0",description:":)"} };

        var email = req.body.email;
        var user_type = req.body.user_type;
        var reset_token = req.body.reset_token;
        var password = req.body.password;

        if (email != null && user_type != null && reset_token != null && password != null) {
            API.database.get_token(email, user_type, function(user){
                if (user) {
                    //response.salt = user;
                    var token = JSON.stringify(user);
                    token = token.replace("{","");
                    token = token.replace("}","");
                    token = token.replace(/"/g,'');
                    token = token.replace("reset:","");
                    if (token == reset_token && token != null){
                        var user = API.database.get_salt(req.body.email, req.body.user_type, function(user){
                            if (user) {
                                var salt = JSON.stringify(user);
                                salt = salt.replace("{","");
                                salt = salt.replace("}","");
                                salt = salt.replace(/"/g,'');
                                salt = salt.replace("salt:","");
                                var hash = API.crypto.createHmac('sha512', salt);
                                hash.update(password);
                                var hashed_password = hash.digest('hex');
                                API.database.update_password(email, user_type, hashed_password, function(user){
                                      if (user) {
                                          //success!
                                          response.success = true;
                                          API.sendResponse(req,res,response);
                                      }
                                      else {
                                          response.status.code = "-22";
                                          response.status.description = "Error updating database";
                                          response.success = false;
                                          API.sendResponse(req,res, response);
                                      }
                                });
                            }
                            else {
                                API.badDataReceived(req,res);
                            }
                        });
                    }
                    else {
                        response.status.code = "-31";
                        response.status.description = "Invalid token";
                        response.success = false;
                        API.sendResponse(req,res, response);
                    }
                }
                else {
                    API.badDataReceived(req,res);
                }
            });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    coupon_create: function(req, res) {
        var response = { status: {code:"0",description:":)"} };

        var business_id = req.body.business_id;
        var coupon_name = req.body.coupon_name;
        var desc = req.body.desc;
        var loc_street = req.body.loc_street;
        var loc_city = req.body.loc_city;
        var loc_state = req.body.loc_state;
        var loc_zip = req.body.loc_zip;

        if (business_id != null && coupon_name != null && desc != null && loc_street != null
            && loc_city != null && loc_state != null && loc_zip != null) {
            API.database.add_coupon(business_id, coupon_name, desc, loc_street, loc_city,
              loc_state, loc_zip,
              function(user) {
                if (user) {
                    response.user = user;
                    API.sendResponse(req,res,response);
                }
                else {
                    response.status.code = "-22";
                    response.status.description = "Error Inserting Into the Database.";
                    API.sendResponse(req,res,response);
                }
              });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    coupons: function(req,res) {
        var response = { status: {code:"0",description:":)"} };
        var coupons = API.database.get_all_coupons(function(coupons){
              if (coupons) {
                  response.coupons = coupons;
                  API.sendResponse(req,res,response);
              }
              else {
                  API.badDataReceived(req,res);
              }
        });
    },
    user: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var user_id = req.query.user_id;

        if (user_id != null) {
          var user = API.database.get_user(user_id, function(user){
              if (user) {
                  response.user = user;
                  API.sendResponse(req,res,response);
              }
              else {
                  response.status.code = -1;
                  response.status.description = "user not found";
                  API.sendResponse(req,res,response);
              }
          });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    user_coupons: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var user_id = req.query.user_id;

        if (user_id != null) {
          var coupons = API.database.get_user_coupons(user_id, function(coupons){
              if (coupons) {
                  response.coupons = coupons;
                  API.sendResponse(req,res,response);
              }
              else {
                  API.badDataReceived(req,res);
              }
          });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    salt: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var email = req.body.email;
        var user_type = req.body.user_type;

        if (email != null && user_type != null) {
          var salt = API.database.get_salt(email, user_type, function(salt){
              if (salt) {
                  response.salt = salt;
                  var string = JSON.stringify(response.salt);
                  string = string.replace("{","");
                  string = string.replace("}","");
                  string = string.replace(/"/g,'');
                  string = string.replace("salt:","");
                  API.sendResponse(req,res,response);
              }
              else {
                  API.badDataReceived(req,res);
              }
          });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    coupon_delete: function(req,res) {
        var response = { status: {code:"0",description:":)"} };

        var user_id = req.body.user_id;
        var coupon_name = req.body.coupon_name;
        var coupon_desc = req.body.coupon_desc;

        if (user_id != null && coupon_name != null && coupon_desc != null) {
            API.database.delete_coupon(user_id, coupon_name, coupon_desc,
              function(user) {
                if (user) {
                    response.success = true;
                    API.sendResponse(req,res,response);
                }
                else {
                    response.success = false;
                    response.status.code = "-22";
                    response.status.description = "Error Deleted From the Database.";
                    API.sendResponse(req,res,response);
                }
            });
        }
        else {
            API.badDataReceived(req,res);
        }
    },
    // generic response handlers
    sendResponse: function (req, res, response_object){
        res.header("Content-Type", "Application/JSON");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers","Content-Type");
        res.status(200).send(response_object);
    },
    badDataReceived: function(req,res, message) {
        if (message == null) message = "bad data received";
        var response = {"status":{
            "code":"-31",
            "description":message
        }};
        res.header("Content-Type", "Application/JSON");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers","Content-Type");
        res.status(400).send(response);
    },
    methodNotAllowed: function(req,res) {
        var response = {"status":{
            "code":"-11",
            "description":"wrong method was used"
        }};
        res.header("Content-Type", "Application/JSON");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers","Content-Type");
        res.status(200).send(response); //this has to be 200 to allow CORS
    },
    serverError: function(req,res, message) {
        // this should probably be logged for QA purposes
        if (message == null) message = "internal server error";
        var response = {"status":{
            "code":"-22",
            "description":message
        }};
        res.header("Content-Type", "Application/JSON");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers","Content-Type");
        res.status(500).send(response);
    },
    notFound: function(req,res) {
        // this should probably be logged for QA purposes
        var response = {"status":{
            "code":"-12",
            "description":"url does not exist"
        }};
        res.header("Content-Type", "Application/JSON");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers","Content-Type");
        res.status(404).send(response);
    }
};
// this must be last.
module.exports = API;
