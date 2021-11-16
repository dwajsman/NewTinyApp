function generateRandomString() {
  let random = "";
  let pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; //62 long
  for (let index = 0; index < 6; index++) {
    const char = pool[Math.floor(Math.random() * 62)];
    random += char;
  }
  return random;
}


function findURLsByUserId(id, urlDatabase) {
  let idUrls = {};
  console.log("id passed to func", id["id"]);

  for (const url in urlDatabase) {
    if (Object.hasOwnProperty.call(urlDatabase, url)) {
      const element = urlDatabase[url];
      console.log('url is', url);
      console.log(element.userID);


    if (element.userID === id["id"]) {
      console.log(element);
      idUrls[url] = element.longURL ;
    }
    console.log('final arr is', idUrls);


    }
  }



  return idUrls;

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


module.exports = { generateRandomString, findURLsByUserId, userByEmail };