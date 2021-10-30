const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.log("Database connection error"));
db.on("open", () => console.log("Connected to database"));

//Schemas
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  fbId: String,
  photo: String,
  accessToken: String,
  wissId: String,
  points: { type: Number, default: 0 },
  institute: String,
  year: String,
  email2: String,
  gender: String,
  phoneNumber: String,
  city: String,
  whyCA: String,
  howCA: String,
  refferalId: String,
  posts: {
    type: [String],
    default: [],
  },
});

const postSchema = new mongoose.Schema({
  postId: String,
  createdAt: { type: Date, default: Date.now() },
});

const contactSchema = new mongoose.Schema({
  wissId: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now() },
});

const ideateSchema = new mongoose.Schema({
  wissId: String,
  email: String,
  field: String,
  idea: String,
  createdAt: { type: Date, default: Date.now() },
});

const shareconSchema = new mongoose.Schema({
  wissId: String,
  email: String,
  type: String,
  contact: String,
  createdAt: { type: Date, default: Date.now() },
});

userSchema.plugin(AutoIncrement, { inc_field: "id" });

//Models
const Users = mongoose.model("users", userSchema);
const Posts = mongoose.model("posts", postSchema);
const Contacts = mongoose.model("contacts", contactSchema);
const Ideates = mongoose.model("ideates", ideateSchema);
const Sharecons = mongoose.model("sharecons", shareconSchema);

module.exports = {
  Users,
  Posts,
  Contacts,
  Ideates,
  Sharecons,
};
