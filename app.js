const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/",function(req,res){

    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;
    const data = {
        members:  [
            {
                email_address:email,
                status:"subscribed",
                merge_fields: {
                    FNAME:firstname,
                    LNAME:lastname
                }
            }
        ]
    };
     
    const jsondata = JSON.stringify(data);

    const url = process.env.URL;

    const options = {
        method:"POST",
        auth:process.env.AUTH_ID
        
    }

    const request = https.request(url ,options ,function(response){

        if (response.statusCode === 200){
            console.log(response)
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsondata);
    request.end(); 

});

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running at port 3000");
});


