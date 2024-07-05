const express = require("express");
const app = express();
const mongo = require("mongoose");
const User = require("./models/user");
const Message = require("./models/message");
const moment = require("moment");
const dotenv = require('dotenv');


dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const port = process.env.PORT || 3000;
const DB = process.env.DATA_BASE_URL;

if (!DB) {
    console.error("DATA_BASE_URL is undefined. Make sure the .env file is properly configured and dotenv is loaded.");
    process.exit(1); 
}

let userName = "";

app.get("/admin", (req, res) => {
    let users = User.find({}).exec();
    let messages = Message.find({}).exec();

    Promise.all([users, messages])
    .then((data) => {
        const users = data[0];
        const messages = data[1];

        res.render("dashboard.ejs", {
            users: users,
            messages: messages,
            moment: moment,
        });
    }).catch((error) => {
        console.log(error);
    });
});

app.get("/welcome", (req, res) => {
    const name = req.query.name;
    userName = name;
    User.findOne({ name: name })
        .then((data) => {
            res.render("welcome.ejs", { data: data });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Error occurred");
        });
});

app.get("/thanks", (req, res) => {
    res.render("thanks.ejs", { userName: userName });
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/", (req, res) => {
    const user = new User(req.body);
    user.save()
        .then(() => {
            res.redirect("/welcome?name=" + encodeURIComponent(req.body.name));
        })
        .catch((err) => {
            res.send(err);
        });
});

app.post("/welcome", (req, res) => {
    const message = req.body;

    if (!message) res.send("You Must Write Something");

    const newMessage = new Message(message);
    newMessage
        .save()
        .then(() => {
            res.redirect("/thanks");
        })
        .catch((error) => {
            console.log(error);
        });
});

mongo
    .connect(DB)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
