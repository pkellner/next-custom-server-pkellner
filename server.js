const { createServer } = require("http");
const { parse } = require("url");
const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get("/login", (req, res) => {
      console.log("in server.js login called");
      return app.render(req, res, "/login");
    });

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
