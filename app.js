const express = require("express");
const axios = require("axios");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("./config/config.json");
require("dotenv").config();
const cors = require("cors");
// const { Users, Posts } = require("./db/mongoConnection");
const indexRouter = require("./routes/index");

const app = express();

app.use(cors());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      let email = profile.emails[0].value;
      let name = profile.displayName;
      let fbId = profile.id;
      let photo = profile.photos[0].value;
      console.log(profile);
      // process.nextTick(async () => {
        try {
          // let postsDocs = await Posts.find();

          let { data: postsDocs } = await axios.get(
            config.mongoConnector + "/posts/find"
          );
          console.log(postsDocs);
          let posts = postsDocs.map((post) => post.postId);
          // let data = await Users.find({ email });
          let { data } = await axios.post(
            config.mongoConnector + "/users/find/email",
            { email }
          );
          console.log(data);
          if (data.length !== 0) {
            return done(null, profile);
          } else {
            // let userInfo = new Users({
            //   email,
            //   name,
            //   fbId,
            //   photo,
            //   accessToken,
            //   posts,
            // });
            // await Users.create(userInfo);

            let userInfo = {
              email, name, fbId, photo, accessToken, posts
            }
            let {data: created} = await axios.post(config.mongoConnector + "/users/create", {userInfo});
            return done(null, profile);
          }
        } catch (error) {
          console.log(error);
          throw error;
        }
      // });
    }
  )
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: "",
//       clientSecret: "",
//       callbackURL: "",
//       userProfileURL: "",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       let email = profile.emails[0].value;
//       process.nextTick(async () => {
//         let userDoc = await Users.find({ email });
//         if (userDoc.length === 0) {
//         }
//       });
//     }
//   )
// );

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "shizou sasageyo", key: "aot" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));
app.use(function (req, res, next) {
  if (!req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});
app.use("/", indexRouter);
//passport
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = app;
