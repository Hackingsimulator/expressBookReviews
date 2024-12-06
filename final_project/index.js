const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next) {
    // Check if the authorization object and accessToken exist in the session
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }
    
    const token = req.session.authorization.accessToken;
    if (!token) {
        return res.status(403).json({ message: "Unauthorized user" });
    }

    // Verify the token
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        // If token is valid, decoded will contain the payload
        // You can attach decoded payload to req for further use if needed
        req.user = decoded;
        next();
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
