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


app.post("/addname", async (req, res) => {
    const { name } = req.body;
    console.log('Request body:', req.body);

    const { data, error } = await supabase.from("test").insert({ name: name }) .select();;
    if (error) {
        res.status(500).json({ error });
    } else {
        res.status(200).json(data);
        console.log('Inserted data:', data);
        console.log('Name:', name);
    }
});



app.listen(port, () => console.log(`Server is running on port ${port}`));