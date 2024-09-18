const express = require('express');
require("dotenv").config();
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for easy to test with Postman
const port = 3300;

const supabaseUrl = 'https://gemuxctpjqhmwbtxrpul.supabase.co'
const supabaseKey = process.env.ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


//signup customer
app.post("/signup-as-customer", async (req, res) => {
    const { email, password } = req.body;
    const {error} = await supabase.auth.signInWithOtp({
        email: email,
        password: password,
        options: {
            shouldCreateUser: false,
        },
    });
    if (error) {
        res.status(500).json(error);
    }
    else {
        const { data, error } = await supabase.from('User').insert([{ Email: email, Password: password, Role: "customer" }]).select("*");
        if (error) {
            res.status(400).json(error);
        }
        else {
            res.status(200).json(data);
        }
    }
});




app.delete("/delete-user", async (req, res) => {
    const { data, error } = await supabase.auth.admin.deleteUser(
        '6761abe7-7ca1-4406-80ba-18ac1288a871'
    )
    if (error) {
        res.status(400).json(error);
    }
    else {
        res.status(200).json(data);
    }
});




app.listen(port, () => console.log(`Server is running on port ${port}`));