const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const session = require("express-session")
const Item = require("../models/item"); // Ensure this file exists


const app = express();

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log('server running on port: ${PORT}')
})

//Middleware to parse form data (converting data into json format)
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//use EJS as the viw engine
app.set('view engine','ejs');

//serve static files
app.use(express.static("public"));

//configure session
app.use(session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized:false,
    cookie:{secure:false}//set to true if using https
}));

//Middleware to check if user is logged in
function requireLogin(req, res, next){
    if(req.session.user){
        next(); //proceed if user is authenticated
    }else{
        res.redirect("/")//Redirect to login if not authenticated
    }
}




//ROUTES
app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/signup", (req,res) => {
    res.render("signup");

});

app.get("/verification", (req, res) => {
    res.render("verification"); // Render smiling face animation page for verification
});




//Register User
app.post("/signup", async(req,res)=>{

    const data={
        name:req.body.username,
        password: req.body.password
    };

//check if the user already exists in the database
    const existingUser = await collection.findOne({name: data.name});

    if(existingUser){
        res.send("User already exists. Please choose a different username.")
    }else{
        //hash the password using bcrypt
        const saltRounds =10;
        const hashedPassword = await bcrypt.hash(data.password,saltRounds);
        data.password= hashedPassword; //Replace the hash password with original password

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect("/"); //Redirect to login page after successful signup

    }
});




// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("Username not found")
        }
        // Compare the password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }

        //Store user session
        req.session.user=check.name;
        res.redirect("/home"); //Redirect to home after successful login
        
    }
    catch {
        res.send("Login failed, please try again");
    }
});


//MAIN PAGE
app.get("/home", requireLogin, async (req, res) => {
    try {
        const items = await Item.find(); // Fetch all items from the database
        res.render("home", { items }); // Pass items to home.ejs
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).send("Internal Server Error");
    }
});


//Logout
app.post("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    });
})






// ===============================ADMIN PANEL =====================================//

// Middleware to protect the admin panel
function requireAdmin(req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        res.redirect("admin/login");// Redirect to the admin login page
    }
}


app.get("/admin/login", (req, res) => {
    res.render("admin_login"); // Make sure you have admin_login.ejs in the views folder
});


// Admin Login
app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123") { 
        req.session.admin = true;
        res.redirect("/admin");
    } else {
        res.send("Invalid credentials");
    }
});

// Logout

app.post("/admin/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
});

// View Admin Panel
app.get("/admin", requireAdmin, (req, res) => {
    res.render("admin");
});

// Add a new item
app.post("/admin/items", async (req, res) => {
    try {
        console.log("Received Data:", req.body); // ✅ Debugging log

        const { name, status, category, ranking, whyThisUniversity, 
            programOfInterest, financialEstimate, campusEnvironment, careerImpact, 
            pros, cons, sources, image, cImage } = req.body;

        const newItem = new Item({
            name,
            status,
            category,
            ranking,
            whyThisUniversity,
            programOfInterest,
            financialEstimate,
            campusEnvironment,
            careerImpact,
            pros,
            cons,
            sources,
            image,
            cImage
        });

        await newItem.save();
        console.log("Saved to Database:", newItem); // ✅ Debugging log

        res.json({ message: "University added successfully", item: newItem });
    } catch (error) {
        console.error("Error adding university:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Get all items
app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

// Delete an item
app.delete("/admin/items/:id", requireAdmin, async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
});


//edit an item
app.put("/admin/items/:id", async (req, res) => {
    try {
        const { name, ranking, status, category, whyThisUniversity, programOfInterest, financialEstimate, campusEnvironment,
            careerImpact, pros, cons, sources, cImage, image} = req.body;
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, { name, ranking, status, category, whyThisUniversity, programOfInterest, financialEstimate, campusEnvironment,
            careerImpact, pros, cons, sources, cImage, image }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item updated successfully", item: updatedItem });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



//=====================================================================================//

//hehehe