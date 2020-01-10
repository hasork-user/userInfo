var express = require("express");
	app = express();
	mongoose = require("mongoose")
	bodyParser = require("body-parser");
	expressSanitizer = require("express-sanitizer");
	methodOverride = require("method-override")

mongoose.connect("mongodb+srv://sand123:sand123@cluster0-t0jwv.gcp.mongodb.net/atii?retryWrites=true&w=majority", {useNewUrlParser : true});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static("public"));
mongoose.set("useFindAndModify", false);

var userSchema = new mongoose.Schema({
	mobile : String,
	name : String,
	age : String
});
var User = mongoose.model("User",userSchema);

app.get("/", function(req,res){
	res.redirect("/home");
});

app.get("/home", function(req,res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		}else{
			res.render("home",{users:users});
		}
	});
});

app.get("/addUser", function(req,res){
	res.render("addUserInfo");
});

app.post("/addUser", function(req,res){
	req.body.user.body = req.sanitize(req.body.user.body);
	User.create(req.body.user, function(err,user){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home");
		}
	});
});

app.get("/user/edit/:id", function(req,res){
	User.findById(req.params.id)
		.exec(function(err,user){
			if(err){
				console.log(err);
			}else{
				res.render("editUser",{user:user});
			}
		});
});

app.put("/user/edit/:id", function(req,res){
	req.body.user.body = req.sanitize(req.body.user.body);
	User.findByIdAndUpdate(req.params.id,req.body.user, function(err,editedUser){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home");
		}
	});
});

app.delete("/user/:id", function(req,res){
	User.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home")
		}
	});
});

app.listen(process.env.PORT,process.env.IP, function(){
	console.log("2000 running");
});	