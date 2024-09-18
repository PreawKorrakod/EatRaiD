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

app.post("/signup", async (req, res) => {
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
    const { email,OTP,role,Name, Contact, OpenTime, CloseTime, Location, Coordinate } = req.body;

    const { data: { session }, error } = await supabase.auth.verifyOtp({
        email: email,
        token: OTP,
        type: 'email',
      });
      if (error) {
        res.status(400).json(error);
      } else {
        console.log(session)
        const { data, error } = await supabase.from('User').insert([{ Id: session.id, Role: role }]).select("*");
          if (error) {
              res.status(400).json(error);
          }
          else {
            
            if (role === 'owner'){
              const { data, error } = await supabase.from('Restaurant').insert([{ Id: session.id, Name: Name, Contact: Contact, 
                OpenTime: OpenTime, CloseTime: CloseTime, Location: Location, Coordinate: Coordinate }]).select("*");
              if (error) {
                  res.status(400).json(error);
              }
              else {
                console.log(session.id)
                res.status(200).json({"verify email": session, "insert data to table user": data})
              }
            } else {
              res.status(200).json({"verify email": session, "insert data to table user": data})
            }
          }}
});

app.delete("/delete-user", async (req, res) => {
  const { data, error } = await supabase.auth.admin.deleteUser(
      '7ccf33f9-e62e-453a-8712-f59741fc1853'
  )
  if (error) {
    res.status(400).json(error);
  }
  else {
      res.status(200).json(data);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));