const express = require("express");

const bodyParser = require("body-parser");

const request = require("request");

const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,resp){
  resp.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,resp){
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

  const url = "https://us18.api.mailchimp.com/3.0/lists/efb5faf617";

  const options = {
    method: "POST",
    auth: "ram:3561a043cd8e00db858f1886e3716a82-us18"
  }

  const request = https.request(url,options,function(response){
    if(response.statusCode === 200){
      resp.sendFile(__dirname+"/success.html");
    }
    else {
      resp.sendFile(__dirname+"/failiure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });

  // request.write(jsonData);
  request.end();

  console.log(firstName+" "+lastName+" "+email);
});

app.post("/failiure",function(req,resp){
  resp.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("server running at port 3000");
});

//API key
// 3561a043cd8e00db858f1886e3716a82-us18    # us18 is the name of server assigned to me

// list id  (audience id)
// efb5faf617
