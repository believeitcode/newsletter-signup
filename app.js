const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public")); //static to tell express to look for css/images in dir.
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html"); // view of signup page
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName =  req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address : email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data)

  const url = "https://us18.api.mailchimp.com/3.0/lists/<LIST-ID>";
  const options = {
    method:"POST",
    auth:"wenjie1:<API-KEY>-us18"
  }

  const request = https.request(url, options , function (response) {

    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }


    response.on("data", function (data) {
        console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function (req, res) {
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
