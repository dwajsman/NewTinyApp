// REQUIRES
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
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

const { generateRandomString, findURLsByUserId, userByEmail } = require("./helper");



app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],

  // Cookie Options
  maxAge: 60 * 60 * 1000 // 1h
}))

// GLOBAL ITEMS

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",
              userID: "a2kjc3",
            },
  "9sm5xK": {longURL: "http://www.google.com",
              userID: "9dds3e",
            }
            
};

const users = {
  "a2kjc3": {
    id: "a2kjc3",
    email: "bill@microsoft.com",
    password: "$2a$10$b3pNdOfR2un6odlr/gPV8OK2gTmydIFCCrlPt4zT1XHIRJszQWy0m"
  }, 
  "9dds3e": {
    id: "9dds3e",
    email: "steve@apple.com",
    password: "$2a$10$/l.LDGnP.CpZD7zF6iaoHOIbiAtnnNxaRSeUNmR3gVaDez2CASdX."
  }
};
// bill -> jkl
// steve -> 123




// Returns the value of the userId cookie
const getUserId = (req, res) => getAppCookies(req, res)['userId'];




// GET POSTs

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/u/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  let longURL = urlDatabase[key]["longURL"];
  if (!urlDatabase[key]) {
    return res.redirect('/');
  }
  res.redirect(longURL);

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

  // let id = req.cookies["user_id"];
  let id = req.session["user_id"];

  if (users[id]) {

    let usrUrls = findURLsByUserId(users[id], urlDatabase);


    let email = users[id].email;
    const templateVars = {
      urls: usrUrls,
      user: users[id],
    };
    res.render("urls_index", templateVars);

    console.log('Cookies: ', req.session["user_id"]);
  } else {
    res.redirect("/login");
  }



});

app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    let longURL = req.body.longURL;
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = {"longURL": longURL,
              "userID": req.session.user_id,
            };

  }
    console.log(urlDatabase);
    res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  if (req.session["user_id"]) {
    let id = req.session["user_id"];
    const templateVars = {
      user: users[id].email,
     // user: req.session.user_id,
    };
    res.render("urls_new");
  } else {
    res.redirect("/login");
  }

  // let id = req.cookies["user_id"];
  // const templateVars = {
  //   id
  // };

});





app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL]["userID"]) {

    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]
    };
    res.render("urls_show", templateVars);
  } else {
    return res.status(400).send("You don't own this URL");
  }

});


app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL]["userID"]) {
    urlDatabase[req.params.shortURL]["longURL"] = req.body.newUrl;
  } else {
    return res.status(400).send("You don't own this URL");
  }
  res.redirect('/urls');
});



app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL]["userID"]) {
    let key = req.params.shortURL;
    delete urlDatabase[key];
  } else {
    return res.status(400).send("You don't own this URL");
  }

  res.redirect('/urls');
});



// REGISTER
app.get("/register", (req, res) => {
  const templateVars = {
    user: req.session.user_id,
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  password = hashedPassword;

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

  req.session["user_id"] = id;
  // res.cookie("user_id", id);
  //id = req.cookies["user_id"];
  // const templateVars = { id };



  console.log(users);
  res.redirect("/urls");
});




// LOGIN

app.get("/login", (req, res) => {
  const templateVars = {
    user: req.session.user_id,

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
  if (email === users[id].email && bcrypt.compareSync(password, users[id].password)) {
  // if (email === users[id].email && password === users[id].password) {
    console.log("hello1", email, id);
    // res.cookie("user_id", id);
    req.session["user_id"] = id;
    res.redirect("/urls");
  } else if (email === users[id].email) {
    return res.status(403).send("Wrong password - try again.");
  } else {
    console.log("nope!");
  }

 


});




app.post("/logout", (req, res) => {
  const { user_id } = req.body;

  // res.clearCookie('user_id', user_id);
  req.session = null;

  res.redirect('/login');
});