const express = require('express');
require("dotenv").config();
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for easy to test with Postman
const port= 3300;

const supabaseUrl = 'https://gemuxctpjqhmwbtxrpul.supabase.co'
const supabaseKey = process.env.ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


app.put("/editmenu", async (req, res) => {
    const {Id,TypeID,NameFood,Price} = req.body;
    const { data, error } = await supabase.from("Menu").update({TypeID,NameFood,Price}).eq("Id",Id).select();
    if (error) {
        res.status(500).json({ error });
    } else {
        res.status(200).json(data);
    }
});



app.listen(port, () => console.log(`Server is running on port ${port}`));