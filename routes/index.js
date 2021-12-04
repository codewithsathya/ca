const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("../config/config.json");
// const {
//   Users,
//   Posts,
//   Contacts,
//   Ideates,
//   Sharecons,
// } = require("../db/mongoConnection");

function ensureAuthenticated(req, res, next) {
  console.log(req.isAuthenticated);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/facebook");
}

async function ensureProfile(req, res, next) {
  console.log(req.user);
  try {
    // let data = await Users.find({ email: req.user.emails[0].value });
    if(!req.user.emails) {
      res.redirect("/?emailError=true")
      return;
    }
    let { data } = await axios.post(
      config.mongoConnector + "/users/find/email",
      { email: req.user.emails[0].value }
    );
    if (data[0].wissId) return next();
    res.redirect("/profile");
  } catch (error) {
    throw error;
  }
}

router.get("/", (req, res) => {
  res.render("index", {appId: process.env.FACEBOOK_APP_ID});
});

router.get(
  "/home",
  ensureAuthenticated,
  ensureProfile,
  async (req, res, next) => {
    // let data = await Users.find({ email: req.user.emails[0].value });
    let { data } = await axios.post(
      config.mongoConnector + "/users/find/email",
      { email: req.user.emails[0].value }
    );
    console.log(data);
    res.render("home", {
      participant: { name: data[0].name, photo: data[0].photo },
    });
  }
);

router.get("/profile", ensureAuthenticated, async (req, res, next) => {
  try {
    // let data = await Users.find({ email: req.user.emails[0].value });
    let { data } = await axios.post(
      config.mongoConnector + "/users/find/email",
      { email: req.user.emails[0].value }
    );
    console.log(data[0]);
    res.render("profile", { participant: data[0] });
  } catch (error) {
    throw error;
  }
});

router.post("/profile", async (req, res, next) => {
  let userDoc;
  if (req.body.howca === "Through a registered CA" || req.body.refca) {
    try {
      // userDoc = await Users.findOne({ email: req.user.emails[0].value });
      let { data: userDocTemp } = await axios.post(
        config.mongoConnector + "/users/findOne/email",
        { email: req.user.emails[0].value }
      );
      userDoc = userDocTemp;
      if (userDoc.wissId) {
        res.redirect("/profile");
      }
      // const reffDoc = await Users.findOne({
      //   wissId: req.body.refca.toLowerCase(),
      // });
      let { data: reffDoc } = await axios.post(
        config.mongoConnector + "/users/findOne/wissId",
        { wissId: req.body.refca.toLowerCase() }
      );
      userDoc.wissId = req.body.wissId.toLowerCase();
      userDoc.email2 = req.body.email2.toLowerCase();
      userDoc.phoneNumber = req.body.phone;
      userDoc.gender = req.body.gender;
      userDoc.institute = req.body.institute;
      userDoc.year = req.body.year;
      userDoc.city = req.body.city;
      userDoc.whyCA = req.body.whyca;
      userDoc.howCA = req.body.howca;
      userDoc.points = 30;
      userDoc.refferalId = req.body.refca.toLowerCase();
      if (reffDoc && reffDoc.wissId) {
        let points = reffDoc.points + 15;
        reffDoc.points = points;
        // await reffDoc.save();
        let { data: reffSaved } = await axios.post(
          config.mongoConnector + "/users/findOneAndUpdate/wissId",
          { userDoc: reffDoc }
        );
      } else {
        console.log("Refferal doesn't exist");
        res.redirect("/profile?error=reffErr");
        return;
      }

      // await userDoc.save();
      let { data: userSaved } = await axios.post(
        config.mongoConnector + "/users/findOneAndUpdate/email",
        { userDoc }
      );
    } catch (error) {
      throw error;
    }
  } else if (req.body.ref) {
    try {
      // userDoc = await Users.findOne({ email: req.user.emails[0].value });
      let { data: userDoc } = await axios.post(
        config.mongoConnector + "/users/findOne/email",
        { email: req.user.emails[0].value }
      );
      if (userDoc.wissId) {
        res.redirect("/profile");
        return;
      }
      userDoc.wissId = req.body.wissId.toLowerCase();
      userDoc.email2 = req.body.email2.toLowerCase();
      userDoc.phoneNumber = req.body.phone;
      userDoc.gender = req.body.gender;
      userDoc.institute = req.body.institute;
      userDoc.year = req.body.year;
      userDoc.city = req.body.city;
      userDoc.whyCA = req.body.whyca;
      userDoc.howCA = req.body.howca;
      userDoc.refferalId = req.body.ref.toLowerCase();
      // await userDoc.save();
      let { data: userSaved } = await axios.post(
        config.mongoConnector + "/users/findOneAndUpdate/email",
        { userDoc }
      );
    } catch (error) {
      throw error;
    }
  } else {
    try {
      // userDoc = await Users.findOne({ email: req.user.emails[0].value });
      let { data: userDoc } = await axios.post(
        config.mongoConnector + "/users/findOne/email",
        { email: req.user.emails[0].value }
      );
      if (userDoc.wissId) {
        res.redirect("/profile");
        return;
      }
      userDoc.wissId = req.body.wissId.toLowerCase();
      userDoc.email2 = req.body.email2.toLowerCase();
      userDoc.phoneNumber = req.body.phone;
      userDoc.gender = req.body.gender;
      userDoc.institute = req.body.institute;
      userDoc.year = req.body.year;
      userDoc.city = req.body.city;
      userDoc.whyCA = req.body.whyca;
      userDoc.howCA = req.body.howca;
      userDoc.refferalId = "";
      // await userDoc.save();
      let { data: userSaved } = await axios.post(
        config.mongoConnector + "/users/findOneAndUpdate/email",
        { userDoc }
      );
    } catch (error) {
      throw error;
    }
  }
  res.redirect("/profile?message=true");
});

router.put("/wissId/:id", async (req, res, next) => {
  let wissId = req.params.id.toLowerCase();
  try {
    // let reffDoc = await Users.findOne({ wissId });
    const { data: reffDoc } = await axios.post(
      config.mongoConnector + "/users/findOne/wissId",
      { wissId }
    );
    if (reffDoc) {
      res.send(reffDoc.name);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    throw error;
  }
});

router.get(
  "/fbshare",
  ensureAuthenticated,
  ensureProfile,
  async (req, res, next) => {
    try {
      // let userDoc = await Users.findOne({ email: req.user.emails[0].value });
      let { data: userDoc } = await axios.post(
        config.mongoConnector + "/users/findOne/email",
        { email: req.user.emails[0].value }
      );
      res.render("fbshare", { participant: userDoc, posts: userDoc.posts });
    } catch (error) {}
  }
);

// router.get("/post", (req, res) => {
//   res.render("addpost");
// });

// router.post("/addpost", async (req, res) => {
//   // let newPost = new Posts({
//   //   postId: req.body.postid,
//   // });
//   // await Posts.create(newPost);
//   try {
//     let { data: postCreated } = await axios.post(
//       config.mongoConnector + "/posts/create",
//       { postId: req.body.postid }
//     );
//     // let users = await Users.find();
//     let { data: users } = await axios.get(config.mongoConnector + "/users/find");
//     for (let i in users) {
//       users[i].posts.push(req.body.postid);
//     }
//     console.log(users);
//     // await Users.bulkSave(users);
//     let { data: usersBulkSaved } = await axios.post(
//       config.mongoConnector + "/users/bulkSave",
//       { users }
//     );
//     res.redirect("/post");
//   } catch (error) {
//     throw error;
//   }
// });

router.get("/contact", ensureAuthenticated, async (req, res, next) => {
  try {
    // let userDoc = await Users.findOne({ email: req.user.emails[0].value });
    let { data: userDoc } = await axios.post(
      config.mongoConnector + "/users/findOne/email",
      { email: req.user.emails[0].value }
    );
    res.render("contact", { participant: userDoc });
  } catch (error) {
    throw error;
  }
});

router.post("/contact", async (req, res, next) => {
  try {
    let subject = req.body.subject;
    let message = req.body.message;
    let email = req.body.email;
    let wissId = req.body.wissId;
    // let contact = new Contacts({
    //   subject,
    //   message,
    //   email,
    //   wissId,
    // });
    let contact = {
      subject,
      message,
      email,
      wissId,
    };
    // await Contacts.create(contact);
    let { data: contactCreated } = await axios.post(
      config.mongoConnector + "/contacts/create",
      { contact }
    );
    res.redirect("/contact?success=true");
    return;
  } catch (error) {
    throw error;
  }
});

router.get(
  "/ideate",
  ensureAuthenticated,
  ensureProfile,
  async (req, res, next) => {
    // let userDoc = await Users.findOne({ email: req.user.emails[0].value });
    let { data: userDoc } = await axios.post(
      config.mongoConnector + "/users/findOne/email",
      { email: req.user.emails[0].value }
    );
    res.render("ideate", { participant: userDoc });
  }
);

router.post(
  "/ideate",
  ensureAuthenticated,
  ensureProfile,
  async (req, res, next) => {
    try {
      let field = req.body.field;
      let idea = req.body.idea;
      let wissId = req.body.wissId;
      let email = req.body.email;
      // let ideate = new Ideates({ field, idea, wissId, email });
      let ideate = { field, idea, wissId, email };
      // await Ideates.create(ideate);
      let { data: ideateCreated } = await axios.post(
        config.mongoConnector + "/ideate/create",
        { ideate }
      );
      res.redirect("/ideate?success=true");
      console.log("headfasdfasdfasdfasdfa");
      return;
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/sharecon",
  ensureAuthenticated,
  ensureProfile,
  async (req, res, next) => {
    // let userDoc = await Users.findOne({ email: req.user.emails[0].value });
    let { data: userDoc } = await axios.post(
      config.mongoConnector + "/users/findOne/email",
      { email: req.user.emails[0].value }
    );
    res.render("sharecontact", { participant: userDoc });
  }
);

router.post(
  "/sharecon",
  ensureAuthenticated,
  ensureProfile,
  async (req, res, next) => {
    try {
      let type = req.body.type;
      let contact = req.body.contact;
      let wissId = req.body.wissId;
      let email = req.body.email;
      // let sharecon = new Sharecons({
      //   type,
      //   contact,
      //   wissId,
      //   email,
      // });
      let sharecon = {
        type,
        contact,
        wissId,
        email,
      };
      // await Sharecons.create(sharecon);
      let { data: sharconCreated } = await axios.post(
        config.mongoConnector + "/sharecon/create",
        { sharecon }
      );
      res.redirect("/sharecon?success=true");
      return;
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/leaderboard",
  ensureAuthenticated,
  ensureProfile,
  async (req, res, next) => {
    try {
      // let userDoc = await Users.findOne({ email: req.user.emails[0].value });
      let { data: userDoc } = await axios.post(
        config.mongoConnector + "/users/findOne/email",
        { email: req.user.emails[0].value }
      );
      // let allUserDocs = await Users.find();
      let { data: allUserDocs } = await axios.get(
        config.mongoConnector + "/users/find"
      );
      allUserDocs = allUserDocs.filter((userDoc) => {
        return userDoc.wissId;
      })
      console.log(userDoc)
      console.log(allUserDocs);
      allUserDocs.sort((a, b) => b.points - a.points);

      let rank = allUserDocs.map((user) => user.wissId).indexOf(userDoc.wissId);
      userDoc.rank = rank;
      res.render("leaderboard", {
        participant: userDoc,
        leaderboard: allUserDocs,
      });
    } catch (error) {
      throw error;
    }
  }
);

router.post(
  "/increase",
  ensureAuthenticated,
  ensureProfile,
  async (req, res, next) => {
    try {
      let postId = req.body.postId;
      let wissId = req.body.wissId;
      // let userDoc = await Users.findOne({ wissId });
      let { data: userDoc } = await axios.post(
        config.mongoConnector + "/users/findOne/wissId",
        { wissId }
      );
      if (userDoc.posts.includes(postId)) {
        let points = userDoc.points + 10;
        userDoc.points = points;
        let index = userDoc.posts.indexOf(postId);
        if (index > -1) {
          userDoc.posts.splice(index, 1);
        }
        // await userDoc.save();
        let { data: userSaved } = await axios.post(
          config.mongoConnector + "/users/findOneAndUpdate/email",
          { userDoc }
        );
        res.sendStatus(200);
        return;
      } else {
        res.sendStatus(200);
        return;
      }
    } catch (error) {
      throw error;
    }
  }
);

router.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy");
});

router.get("/datadeletion", (req, res) => {
  res.render("dataDeletion");
});

module.exports = router;
