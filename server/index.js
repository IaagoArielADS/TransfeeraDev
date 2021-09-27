const express = require("express");
const app = express();
const mysql = require("mysql")

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database="employeeSystem"
})

app.post("\create", (req, res)=>{
    const name = req.body.name

    db.query("INSERT INTO employees (name) VALUES (?)", 
    [name], (err, result)=>{
       if(err){
           console.log(err)
       } else {
           res.send("Values inserted")
       }
    })
})

app.listen(3001, ()=> {
    console.log("Server Running in port 3001");
});

