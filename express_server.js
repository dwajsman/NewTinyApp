// REQUIRES
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.use(cookieParser());
// app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.urlencoded({
  extended: true
}));


// GLOBAL ITEMS

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "a2kjc3": {
    id: "a2kjc3",
    email: "bill@microsoft.com",
    password: "vaccinechip"
  },
  "9dds3e": {
    id: "9dds3e",
    email: "steve@apple.com",
    password: "windowssuks"
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



function userByEmail(users, email) {
  for (const user_id in users) {
    if (Object.hasOwnProperty.call(users, user_id)) {
      const user = users[user_id];
      if (email === user["email"]) {
        return user_id;
      };
    };
  };
};






// Returns the value of the userId cookie
const getUserId = (req, res) => getAppCookies(req, res)['userId'];




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

  let id = req.cookies["user_id"];
  if (users[id]) {
    let email = users[id].email;
    const templateVars = {
      urls: urlDatabase,
      user: users[id],
    };
    res.render("urls_index", templateVars);

    console.log('Cookies: ', req.cookies["user_id"]);
  } else {
    res.redirect("/login");
  }



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
  // let id = req.cookies["user_id"];
  // const templateVars = {
  //   id
  // };
  const templateVars = {
    user: req.cookies.user_id,
  };
  res.render("urls_new");
});





app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});



// REGISTER
app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies.user_id,
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  if (users[userByEmail(users, email)]) {
    return res.status(400).send("Email already used");
  };

  users[id] = {
    id: id,
    email: email,
    password: password,
  };

  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  };

  res.cookie("user_id", id);
  //id = req.cookies["user_id"];
  // const templateVars = { id };



  console.log(users);
  res.redirect("/urls");
});




// LOGIN

app.get("/login", (req, res) => {
  const templateVars = {
    user: req.cookies.user_id,
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  }
  //console.log(email, password);
  let id = userByEmail(users, email);
  //console.log(id);
  if (!id) {
    return res.status(403).send("This email cannot be found.");
  }
  if (email === users[id].email && password === users[id].password) {
    console.log("hello1", email, id);
    res.cookie("user_id", id);
    res.redirect("/urls");
  } else if (email === users[id].email) {
    return res.status(403).send("Wrong password - try again.");
  } else {
    console.log("nope!");
  }

 


});




app.post("/logout", (req, res) => {
  const { user_id } = req.body;

  res.clearCookie('user_id', user_id);


  res.redirect('/login');
});
