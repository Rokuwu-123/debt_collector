import express from 'express'
import http from 'http'
import rateLimit from 'express-rate-limit'

import auth from './app/auth/auth.js'
import users from './app/routes/users.js'

const app = express()
app.disable("x-powered-by")

const port = 3000
const host = "0.0.0.0"

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  headers: false,
  legacyHeaders: false,
  message: {
    responseCode: '17',
    description: "Too Many Request"
  }
});

app.set("views", "app/views");
app.set("view engine", "ejs");
app.set(express.json())

app.use(limiter);

app.get("/", (req, res) => {
  res.render("index", {});
});
app.use(auth)
app.use(users)

const server_http = http.createServer(app);
server_http.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});