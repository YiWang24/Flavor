if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //Load environment variables from .env in development
}
const express = require("express");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
//Include database and session
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const MongoDBStore = require("connect-mongo");
const session = require("express-session");
const helmet = require("helmet");
const flash = require("connect-flash");
const passport = require("./config/passport.js");
//Include routes
const userRoutes = require("./routes/userRoutes.js");
const menuRoutes = require("./routes/menuRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js")

//Include environment variables
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/Flavor"; //Fallback to local mongoDB
const port = process.env.PORT || 9999;
const secret = process.env.SECRET || "thisismysecret";

//Set express engine
const app = express();
app.engine("ejs", ejsMate); //Set ejsMate as the template engine for rendering .ejs files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //Define the folder where views are stored

//Use express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse incoming requests with URL-Encoded payloads
app.use(methodOverride("_method")); //Enable method override for PUT/DELETE in forms
app.use(express.static(path.join(__dirname, "public"))); //Save static files from the "public" directory
app.use("/uploads", express.static("uploads"));
//Sanitize user input to prevent MongoDB operator injection attacks
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

//Set up session store using MongoDB
mongoose.connect(dbUrl);
const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 7 * 24 * 60 * 60,
});
//Configure session settings
const sessionConfig = {
  store, //Store sessions in MongoDB
  name: "session",
  secret,
  resave: false, // Do not resave the session if it is not modified
  saveUninitialized: true, //Only save sessions when something is stored in them
  cookie: {
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 25 * 7,
  },
};

app.use(session(sessionConfig)); // Enable session middleware
// Handle session store errors
store.on("error", function (e) {
  console.log("Session Store Error", e);
});
// Use Helmet to set secure HTTP headers
// app.use(helmet());

//Enable flash messaging
app.use(flash());
// Initialize  Passport
app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login sessions

// Middleware to set flash messages and user data globally for every request
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
//Set routes
app.use("/", userRoutes);
app.use("/menus", menuRoutes);
app.use()

app.get("/", (req, res, next) => {
  res.render("home");
});

app.all("/*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

//Set listening
app.listen(port, () => {
  console.log(`Serving on the Port ${port}`);
});
