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

app.post("/signup-as-customer", async (req, res) => {
  const { email, password } = req.body;
  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })
  if (error) {
      res.status(500).json(error);
  }
  else {
      res.status(200).json(data);
  }
});

app.post("/verify-OTP", async (req, res) => {
    const { email,OTP } = req.body;

    const { data: { session }, error } = await supabase.auth.verifyOtp({
        email: email,
        token: OTP,
        type: 'email',
      });
      
      if (error) {
        res.status(400).json(error);
      } else {
        const { data, error } = await supabase.from('User').insert([{ Id: session.id, Role: "customer" }]).select("*");
          if (error) {
              res.status(400).json(error);
          }
          else {
            console.log(session.id)
            res.status(200).json({"verify email": session, "insert data to table user": data})
          }}
});

app.get("/allrestaurant", async (req, res) => {
  let { data, error } = await supabase.from('typerestaurant').select("*")
  if (error) {
      res.status(500).json(error);
  }
  else {
      res.status(200).json(data);
  }
});

app.put("/editprofile", async (req, res) => {
    const {RestaurantId,Name,Contact,OpenTime,CloseTime,Location,Latitude,Longitude} = req.body;
    let { data, error } = await supabase.from('Restaurant')
    .update({
      Name,
      Contact,
      OpenTime,
      CloseTime,
      Location,
      Latitude,
      Longitude})
      .eq('RestaurantId', RestaurantId)
      .select("*")
    if (error) {
        res.status(500).json(error);
    }
    else {
      console.log(Name);
      res.status(200).json(data);
    }
  });



app.delete("/delete-user", async (req, res) => {
  const { data, error } = await supabase.auth.admin.deleteUser(
      '723b7ddf-38c9-4eac-8a2e-07f87e09e418'
  )
  if (error) {
    res.status(400).json(error);
  }
  else {
      res.status(200).json(data);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));