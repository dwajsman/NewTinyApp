// REQUIRES
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));



// GLOBAL ITEMS

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

function generateRandomString() {
  let random = "";
  let pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; //62 long
  for (let index = 0; index < 6; index++) {
    const char = pool[Math.floor(Math.random() * 62)];
    random += char;
  }
  return random;
}


// GET POSTs

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// testing code with 'Hello World'
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// test if request visible for dif pages (isn't!)
app.get("/set", (req, res) => {
 const a = 1;
 res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
 res.send(`a = ${a}`);
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  //console.log(longURL);  // Log the POST request body to the console
  //res.send("Ok");

  console.log(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  
  
});

app.post("/register", (req, res) => {
  res.render("register");
  
});




