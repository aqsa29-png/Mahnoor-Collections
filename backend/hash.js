// hash.js
const bcrypt = require("bcryptjs");

const password = "admin123"; // <-- yahan apna real admin password likho
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) throw err;
  console.log("Your hashed password: ", hash);
});
