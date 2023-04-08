const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

mailchimp.setConfig({
    apiKey: "55f320e3f5b676ad062e37c5639cfcd4-us8",
    server: "us8"
});

/* This line is required for express to serve a 
static page which will pull from the pulic folder. 
Remember that the path will be relative to public, 
so in the html file, we'd call the stylesheet 
via "css/styles.css" */
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
   
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    const url = "https://us8.api.mailchimp.com/3.0/lists/2c9e906e25a";

    const options = {
        method: "POST", 
        auth: "Fatima1:55f320e3f5b676ad062e37c5639cfcd4-us8"
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            console.log("The status code is :"+response.statusCode);
            if(response.statusCode == 200){
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }

        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})

//API Key
// 55f320e3f5b676ad062e37c5639cfcd4-us8

//List id
//2c9e906e25