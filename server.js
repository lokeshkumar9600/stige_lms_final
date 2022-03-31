const express = require("express");
var session = require('express-session');

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://lokixgodf:Loki.sg5656@cluster0.vw0lu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser : true , useUnifiedTopology:true});
let  bodyParser = require('body-parser');
var ejs = require('ejs');
const app = express();
let emailx = ""
var flash = require('connect-flash');
app.use(flash());
app.set('view engine', 'ejs');
app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/"+"homepage.html");

});
app.get("/sign-up" , (req,res)=>{
    res.sendFile(__dirname+"/"+"signup-page.html");
    
});
app.get("/error",(req,res)=>{
    res.render("errors",{});
});

app.post("/del",(req,res)=>{
main.updateOne({"email":emailx},{ $pull: { 'Account': { Description: req.body.del } } },(err,done)=>{
    if(err){
        console.error(err)
    }else{
        res.redirect("/main/taskmanager");
    }
});
})


    
// generation of the account 
app.post("/sign-up" , (req,res)=>{
  
    main.create({
       firstname : req.body.firstName,
       lastname : req.body.lastName,
    //    number: req.body.phonenumber,
       email : req.body.email,
       password : req.body.password
    }, function(err,save){
        if(err){
            console.error(err)
        }else{
            console.log(save);
            res.redirect("/")
        }
    });
   });




// app.post("/dec",(req,res)=>{
// console.log(req.body.dec);
// console.log("Reached")
// main.updateOne({"email":emailx,"Account.Description":req.body.dec},{$pull:{Account:Description}},(err,save)=>{
//     if(err){
//         console.log(err)
//     }else{
        
//         res.redirect("/main/taskmanager")
//     }
// });
// })


app.get("/main/course",(req,res)=>{
    res.render("course")
})

app.get("/main/profile",(req,res)=>{

    let c = req.flash('email');
main.findOne({email:c},(err,save)=>{
    res.render("profile",{save:save})
})

});


// authentication of the account
app.post("/", (req,res)=>{
    emailx = req.body.emaildb;
    let pass = req.body.password;
    console.log(emailx,pass)
    main.findOne({email:emailx},function(err,user){
        console.log(user)
        if(err){
            console.error(err);
        }else{
                if(user.password === pass){
                    app.get("/main/taskmanager",(req,res)=>{
                        main.findOne({email:emailx},(err,save)=>{
                            if(err){
                                console.log(err);
                            }else{
                                // req.flash('email',save.email)
                            res.render("taskmanager",{save:save})
                           
                            }
                        }); 
                 
                    });
                    app.get("/main",(req,res)=>{
                        main.findOne({email:emailx},(err,save)=>{
                            if(err){
                                console.log(err);
                            }else{
                                req.flash('email',save.email)
                            res.render("main",{save:save})
                           
                            }
                        }); 
                    });
                    

                    res.redirect("/main") 
                }else{
                  app.get("/error" , (req,res)=>{
                      res.render("/error")
                  });
                  res.redirect("/error");
                };       
        };
    });
});


app.post("/main/taskmanager",(req,res)=>{
    let Acc = new account({
        Description:req.body.goal,
        Deadline:req.body.note
        // finalAmount:req.body.final,
        // InitialAmount:req.body.initial
    });
    Acc.save()
    const passwordx = req.body.password;
       main.findOne({email:emailx},function(err,user){
           if(err){
               console.error(err);
           }else{
               if(user.password === passwordx){
                   main.updateOne({password:passwordx},{"$push":{Account:Acc}},function(err,done){
                       if(err){
                           console.error(err)
                       }else{
                           
                           res.redirect("/main/taskmanager")
                       }
                   });
               }
               else{
                   app.get("/error1",(req,res)=>{
                       res.render("error1",{})
                   })
                   res.redirect("/error1")
               }
           }
       })
   

})
//database section
var accountSchema =  new mongoose.Schema({
    
    Description: String,
    completed:{type: Boolean, default: false},
    Deadline:Date    
});

var maindb = new mongoose.Schema({
    firstname :String,
    lastname : String,
    email : String,
    password : String,
    Account:[accountSchema]
});
var main = mongoose.model("main",maindb);
var account = mongoose.model("account",accountSchema)

// const one = new account({
//     goal:"ghghhgh",
//     finalAmount:12000,
//     InitialAmount:0,
//     Note:"gjggf"
// })
// one.save()


//end of database section
app.post("/inc",(req,res)=>{
    console.log("hello reached inc route")
    console.log(req.body.i)
    console.log(req.body.ic)
    main.updateOne({"email":emailx,"Account.goal":req.body.i},{$inc:{"Account.$.InitialAmount":req.body.ic}},(err,save)=>{
        if(err){
            console.log(err)
        }else{
            
            res.redirect("/main")
        }
    });
    });

app.listen(process.env.PORT || port, ()=>{
    console.log("server is running");
});