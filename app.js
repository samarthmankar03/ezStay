if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");  
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const dbUrl = process.env.ATLASDB_URL;


main()
    .then((res)=>{
        console.log("connected to DB");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {     
    store,
    secret : process.env.SECRET, 
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 1000 * 60 * 60 * 24,
        maxAge: 7 * 1000 * 60 * 60 * 24, 
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash()); 

app.use(passport.initialize());  
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Make currentUser available in all templates
    console.log(res.locals.success);
    console.log(res.locals.error);
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("",userRouter);

// Catch-all for 404 errors
app.use((req, res, next) => {
  res.status(404).render("listings/error", { message: "Page Not Found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

// Start server
app.listen(8080, () => {
  console.log("Listening on port 8080");
});

