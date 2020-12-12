require("dotenv").config();
const mongoose = require("mongoose");
const firebase = require("firebase-admin");

const serviceAccount = require("./firebasekey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB,
});

// var firedb = firebase.database();
// var docref = firedb.ref("restricted_access/secret_document");


mongoose.connect(process.env.HOST, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  mongoose.connection
    .once("open", () => console.log("DB Connected"))
    .on("error", (error) => {
      console.log("Error While Connecting With DB");
    });
  
  module.exports = { mongoose };