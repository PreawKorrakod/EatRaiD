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


// ===========================favorite===========================

app.post("/get-fav-list", async (req, res) => {
  const { user } = req.body;

  const { data: fav, error } = await supabase
    .from('Favorite')
    .select('*')
    .eq('UserId', user)
    .order('Id', { ascending: true })

    if (error) {
      res.status(400).json(error);
    } else {
      res.status(200).json(fav)
    }
});

app.post("/add-to-fav", async (req, res) => {
  const { user, restaurant } = req.body;
  console.log(user, restaurant)
  const { data, error } = await supabase
    .from('Favorite')
    .insert([
      { RestaurantId: restaurant, UserId: user },
    ])
    .select()

    if (error) {
      res.status(400).json(error);
    } else {
      res.status(200).json(data)
    }
});

// ===========================test===========================

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