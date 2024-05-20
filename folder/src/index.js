const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");

const app = express();
const PORT = 3000;

//use EJS as the view engine
app.set('view engine', 'ejs');

// static file -> to use css
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

//convert data to JSON FORMAT
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded

app.set('views', path.join(__dirname, '..', 'view'));

app.get("/login", (req, resp) => {
    resp.render("login") //rendering login.ejs
})

app.get("/", (req, resp) => {
    resp.redirect("/login");
})

app.get("/signup", (req, resp) => {
    resp.render("signup") //rendering signup.ejs
})

app.post('/signup', async (req, resp) => {
    const { username, password } = req.body;

    // Hash the password
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    //checking if user already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        // resp.send("User already exists. Try again with different username")
        setTimeout(() => {
            console.log("Redirecting to login page...");
            resp.redirect('/login'); // Redirecting to login page
        }, 5000) // after 5 seconds
    }
    else {

        //hashing the password using bcrypt library 
        const salt = 10; //by-default it is 10
        const hashedPassword = await bcrypt.hash(data.password, salt);

        //replacing hashedPassword with the original
        data.password = hashedPassword;
        // Assuming `collection` is a MongoDB collection
        const userData = await collection.insertMany(data);

        console.log(userData);
        // Redirect or send a response after successful registration
        console.log("Redirecting to login page...");
        resp.redirect('/login');
    }
});

//LOGIN PAGE AND REDIRECT TO HOMEPAGE
app.post('/login', async (req, resp) => {
    try {
        const userCheck = await collection.findOne({ name: req.body.username });
        if (!userCheck) {
            resp.send("User cannot be found");
        }
        const passwordMatch = await bcrypt.compare(req.body.password, userCheck.password);
        if (passwordMatch) {
            resp.render("home");
        }
        else {
            resp.send("Incorrect password");
        }
    }
    catch {
        resp.send('Wrong Details')
    }
})

//LOGOUT
app.get("/logout", (req, resp) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
        } else {
            console.log("User logged out successfully");
            resp.redirect("/login");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})