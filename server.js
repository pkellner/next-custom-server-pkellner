const { createServer } = require("http");
const { parse } = require("url");
const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

passport.serializeUser(function(user, cb) {
  cb(null, 101);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, "testuser");
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    // I'M EXPECTING THIS CONSOLE.LOG TO BE HIT BASEED ON THE SERVER.POST BELOW AND IT IS NOT
    console.log(
      `LocalStrategy Function: username:${username} password:${password}`
    );
    return done(username);
  })
);

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(passport.initialize());

    server.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    server.get("/login", (req, res) => {
      console.log("in server.js login called...");
      return app.render(req, res, "/login");
    });

    server.post(
      "/login",
      passport.authenticate("local", {
        failureRedirect: "/login"
      }),
      (req, res) => {
        console.log(
          `server.post login   req.body.username:${
            req.body.username
          } password:${req.body.password}`
        );
      }
    );

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000...");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
