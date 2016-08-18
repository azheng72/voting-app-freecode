'use strict';
var path = process.cwd();
var User = require(path+'/app/models/user');
var Pool = require(path+'/app/models/pool');

module.exports=function(app,passport){

    function signUp(req,res,next){
        if(!req.body.username || !req.body.password){
            res.status('400');
            return res.end();
        }
        User.findOne({'user.username':req.body.username},
            function(err,user){
                if (err) { 
                    console.error(err);
                    res.status('400');
                    return res.end();
                }
                if (user) {
                    console.log("username already registered");
                    res.status('422');
                    return res.end();
                 }
                var newUser=new User;
                newUser.user.username=req.body.username;
                newUser.user.password=req.body.password;
                newUser.save(function (err) {  //save to db
            			if (err) {
            				throw err;
        			    }
                        next();
                });
        }
    )}
    
    function setPoolCki(req,res,next) {
        res.clearCookie('pool');
        console.log(req.params.poolname);
        Pool.findOne({poolname:req.params.poolname},
            function(err, pool) {
                if(err){
                    console.error(err);
                    res.cookie('pool',{error:'db error'});
                    return next();
                }
                if(!pool){
                    console.log("pool not found")
                    res.cookie('pool',{error:'pool not found'});
                    return next();
                }
                res.cookie('pool',pool);
                return next();
                
            }
        );
    }  
        
    function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
		    if(req.method=='POST'){
		        res.status('401');
		        res.end();
		    }
		    else{
		        res.redirect('/login');
		    }
			
		}
	}
    
    function addPool(req, res, next){
        
        Pool.findOne({poolname:req.body.poolname},
            function(err,pool){
                if (err) { 
                    console.error(err);
                    res.status('400');
                    return res.end();
                }
                if (pool) {
                    console.log("pool already registered");
                    res.status('422');
                    return res.end();
                 }
                var newPool=new Pool;
                newPool.poolname=req.body.poolname;
                newPool.username=req.user.user.username;  //deserialized from passport
                req.body.options.forEach(function(val){
                    newPool.options.push({name:val.name,vote:0});
                });
                //newPool.options.concat(req.body.options);
                newPool.save(function (err) {  //save to db
            			if (err) {
            				throw err;
        			    }
        			    console.log("insert new pool success")
                        next();
                });
            }
        );
    }
    
    function updateVote(req,res,next){
        console.log(JSON.stringify(req.body));
        Pool.findOne({poolname:req.body.poolname},
            function(err,pool){
                if (err) { 
                    console.error(err);
                    res.status('400');
                    return res.end();
                }
                if (!pool) {
                    console.log("pool not found, update fail");
                    res.status('422');
                    return res.end();
                 }
                pool['options'].forEach(function(val,idx){
                    if(val.name==req.body.updateOption.name){
                         val.vote=req.body.updateOption.vote;
                     }
                    if(idx>=pool['options'].length-1){
                         
                        pool.save(function (err) {  
            			    if (err) {throw err;}
            			    res.status('200');
        			        console.log("Vote update success");
                            next();
                        });
                    }
                });
                
            }
        );
    }
    
    app.route('/test')
        .get(function(req,res){
            res.sendFile(path+'/client/site/index.html');
        });
        
    app.route('/templates/*') //send template to client
        .get(isLoggedIn,function(req,res){
            res.sendFile(path + req['originalUrl'].replace('/templates',"")); //remove "/template"
        });
        
    app.route('/')
        .get(isLoggedIn,function(req,res){
            res.redirect('/' + req.user.user.username + '/index'); // req.user.user.username is where passport put the user document after deserialized from session passport.id. 
        });
    
    app.route('/:username/index')
        .get(isLoggedIn,
            function(req,res){  //
                res.sendFile(path+'/client/site/index.html');
            }
        );
        
    app.route('/login')
        .get(function(req,res){
            res.sendFile(path+'/client/site/login.html');
        });
       
   	app.route('/logout')
	    .get(function (req, res) {
		    req.logout();
		    res.redirect('/login');
	    }); 
	
    app.route('/signup')
        .get(function(req,res){
            res.sendFile(path+'/client/site/signup.html');
        });  
        
    app.route('/pool/:poolname')
        .get(setPoolCki,
            function(req,res){
                res.sendFile(path+'/client/site/vote.html');
            }
        );     
        
    app.route('/api/login')
        .post(
            passport.authenticate('local'), //access to next middleware when passport authenticate success, otherwise stop here
            function(req,res){              //login success
                res.redirect('/' + req.body.username + '/index');
            }
        );
        
    app.route('/api/signup')
        .post(signUp,
                passport.authenticate('local'), //access to next middleware when passport authenticate success, otherwise stop here
                function(req,res){              //signed up and login success
                    res.redirect('/' + req.body.username + '/index');
                }
        );
      
    app.route('/api/basicinfo')
        .post(isLoggedIn, 
            function(req, res) {
                res.json({username:req.user.user.username});
            }
        );
        
    app.route('/api/addpool')
        .post(isLoggedIn,
                function(req,res,next){  //tranfer all non [A-z][0-9]_ to space
                    req.body.poolname=req.body.poolname.replace(/\W/g,"_");
                    req.body.options.forEach(function(val){
                        req.body.options.name=val.name.replace(/\W/g,"_");
                    });
                    next();
                },
                addPool,
                function(req,res){   //addPool success
                    res.json({url: req.protocol + '://' + req.get('host') + '/pool/' + req.body.poolname});
                }
        );
        
    app.route('/api/vote')
        .post(
            updateVote,
                function(req,res){   //addPool success
                    res.end();
                }
        );    
        
};