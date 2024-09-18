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


app.post("/verify-OTP", async (req, res) => {
    const { email,OTP } = req.body;
    console.log('Request body:', req.body);

    const { data: { session }, error } = await supabase.auth.verifyOtp({
        email: email,
        token: OTP,
        type: 'email',
      });
      
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('User is now signed up!', session);
      }
      
});

app.post("/login", async (req, res) => {
    const { email,password } = req.body;
    console.log('Request body:', req.body);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    
    if (error) {
        return res.status(401).json({ message: 'Login failed', error: error.message });
    } else {
        return res.status(200).json({ message: 'Login successful', user: data.user, session: data.session });
    }
});




app.listen(port, () => console.log(`Server is running on port ${port}`));