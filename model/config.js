var admin = require("firebase-admin");

var serviceAccount = require("./facefit.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://facefit-8c46d.firebaseio.com"
});

module.exports = admin;