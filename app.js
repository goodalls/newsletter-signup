require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const request = require("request");
const dir = __dirname;
const https = require("https");
const key = process.env.key;
const listID = process.env.list_id;
const url = process.env.url;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(dir + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: "jeffster:" + key,
  };
  const request = https.request(
    url + "/lists/" + listID,
    options,
    (response) => {
      if (response.statusCode === 200) {
        res.sendFile(dir + "/success.html");
      } else {
        res.sendFile(dir + "/failure.html");
      }
      response.on("data", (data) => {
        console.log(JSON.parse(data));
      });
    }
  );
  request.write(jsonData);
  request.end();
});

app.get("/failure", () => {
  app.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
