const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/CseDevops")
.then(() => console.log("Connection Success"))
.catch(() => console.log("Connection failed"));

const loginSchema = new mongoose.Schema(
{
    user: String,
    pass: String,
},
{
    versionKey: false
}
);

const loginModel = mongoose.model('csecrypt', loginSchema, 'cse_logins');


// ✅ REGISTER
app.post('/register', async (req, res) => {
    try {
        const { user, pass } = req.body;

        const userExists = await loginModel.findOne({ user });
        if (userExists) {
            return res.status(409).send("User already exists");
        }

        const hashpass = await bcrypt.hash(pass, 10);

        const newUser = new loginModel({
            user,
            pass: hashpass
        });

        await newUser.save();
        res.status(201).send("User Registered Successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("Error Occurred");
    }
});


// ✅ LOGIN
app.post('/login', async (req, res) => {
    try {
        const { user, pass } = req.body;

        const user1 = await loginModel.findOne({ user });
        if (!user1) {
            return res.status(404).send("User not found");
        }

        const passMatch = await bcrypt.compare(pass, user1.pass);
        if (passMatch) {
            res.status(200).send("Welcome");
        } else {
            res.status(401).send("Invalid password");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error Occurred");
    }
});

app.listen(4000, () => {
    console.log("Server is running successfully");
});