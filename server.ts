const { createServer } = require("http");
const { parse } = require("url");
const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

passport.serializeUser(function(user, cb) {
  cb(null, 101);
});

passport.deserializeUser(function(id, cb) {
  // db.users.findById(id, function(err, user) {
  //   if (err) {
  //     return cb(err);
  //   }
  //   cb(null, "testuser");
  // });
  cb(null, "testuser");
});

passport.use(
  new LocalStrategy(function(username : string, password, done) {
    console.log(
      `LocalStrategy Function: username:${username} password:${password}`
    );
    if (username === password) {
      return done(
        null,
        { username: username },
        {
          message: "where does this message come out?"
        }
      );
    }
    return done(false, false, {
      message: "failure, nuclear meltdown"
    });
  })
);

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cookieParser("keyboard cat"));
    server.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    server.use(bodyParser.json());
    server.use(
      session({
        cookie: {
          maxAge: 60000,
          secret: "secret cat",
          resave: true,
          saveUninitialized: true
        }
      })
    );
    server.use(flash());
    server.use(passport.initialize());
    server.use(passport.session());

    //route for error page
    server.get("/error", function(req, res, next) {
      var aaa = req.flash("error")[0];
      return app.render(req, res, "/error");
    });

    server.get("/flash", function(req, res) {
      req.flash("info", "Flash is back!");
      res.redirect("/error");
    });

    server.get("/success", function(req, res) {
      var aaa = req.flash("success");
      return app.render(req, res, "/success");
    });

    server.get("/login", (req, res) => {
      console.log("in server.js login called...");
      return app.render(req, res, "/login");
    });

    // server.post(
    //   "/login",
    //   passport.authenticate("local", (err, user, info) => {
    //     // err is only set on catch, user is false if auth fails
    //     // FOR SOME REASON, ERR COMES IN UNDEFINED EVEN WHEN THERE IS AN ERROR. USER IS EMPTY AND INFO.MESSAGE IS REALLY ERROR
    //     if (user === false) {
    //       return next(err);
    //     }
    //   }),
    //   (req, res) => {
    //     console.log(
    //       `success: server.post login   req.user.username:${
    //         req.user.username
    //       }  req.authInfo.message:${req.authInfo.message}`
    //     );
    //   }
    // );

    server.post(
      "/login",
      passport.authenticate("local", {
        failureRedirect: "/error",
        successRedirect: "/success",
        successFlash: "Welcome!",
        failureFlash: true,
        successFlash: true
      }),
      (req, res) => {
        console.log(
          `success: server.post login   req.user.username:${
            req.user.username
          }  req.authInfo.message:${req.authInfo.message}`
        );
      }
    );

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3001, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3001...");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
