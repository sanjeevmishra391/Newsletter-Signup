const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/1676aa846a";

  const options = {
    method: "POST",
    auth: "sanjeevmishra391:466cfe80709753729358448f8c34f828-us1a"
  }

  const request = https.request(url, options, (response) => {

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      return res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000);

//api key
// 466cfe80709753729358448f8c34f828-us1

// listen
// 1676aa846a
