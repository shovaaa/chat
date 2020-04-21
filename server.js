const express = require("express");
const server = express();
const bodyParser = require("body-parser")

let mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users'
})

connection.connect(function(err){
    if(err) throw err
        console.log("You're connected.")  
})

const urlencodedParser = bodyParser.urlencoded({extended: false});

server.set("view-engine", "ejs")
//server.use(express.urlencoded({ extended: false}));

server.get("/", (req, res)=>{
    res.render("index.ejs")
})

server.post("/", urlencodedParser, (req, res)=>{
    const sql = "INSERT INTO `register` (`fname`,`lname`,`uname`,`email`,`pwd`) VALUES ('"+ req.body.fname +"', '"+ req.body.lname +"', '"+ req.body.uname +"', '"+ req.body.email +"', '"+ req.body.password +"')";
    
    connection.query(sql, function(err){
        if(err) throw err
            console.log("This route is working-1")  
    })
    return res.redirect("/login");
});

server.get("/login", (req, res)=>{
    res.render("login.ejs")
})

server.post("/login", urlencodedParser, (req, res)=>{
    const name = req.body.uname
    const uemail = req.body.email
    const upwd = req.body.password
    
    const select = "SELECT * FROM `register` WHERE `uname`= '"+ name + "' AND `email`='"+ uemail +"' AND `pwd`='"+ upwd +"'"
    connection.query(select, function(err, rows){
        if(err)throw err
        console.log("This route is working-2") 
      
        if(!rows[0]) {
           res.redirect("/");
       }else{
           res.redirect("/chat");
       };
      
    });   
});

server.get("/chat", (req, res)=>{
    connection.query("SELECT `uname` FROM `register`", (err, rows)=>{
        if(err) throw err
        console.log("This route is working-3"); 
        const row = rows.map(e => e.uname) ;
        
        res.render("chat.ejs", {name: row });
        
    });
    
    
});

//connection.end();
server.listen(3000);