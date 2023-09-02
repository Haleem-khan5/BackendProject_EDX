const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const call_back_routes = require ('./router/Node.js').call_back_route;

const app = express();
const your_secret_key = "8942352137895bsdfjhsdfg34278";
app.use(express.json()); // Example middleware function to parse JSON bodies
app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  // Authentication mechanism using JWT

  // Retrieve the JWT token from the request headers
  const token = req.headers.authorization;

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }
   
  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, your_secret_key);

    // Attach the decoded user information to the request object
    req.user = decoded.user;

    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
