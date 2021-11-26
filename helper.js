function generateRandomString() {
  let random = "";
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 0; index < 6; index++) {
    const char = pool[Math.floor(Math.random() * 62)];
    random += char;
  };
  return random;
};



function findURLsByUserId(id, urlDatabase) {
  let idUrls = {};
  for (const url in urlDatabase) {
    if (Object.hasOwnProperty.call(urlDatabase, url)) {
      const element = urlDatabase[url];
    if (element.userID === id["id"]) {
      idUrls[url] = element.longURL ;
    };
    };
  };
  return idUrls;
};



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