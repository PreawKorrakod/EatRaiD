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

// ===========================user management===========================

app.post("/login", async (req, res) => {
  const { email,password } = req.body;

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

// ===========================favorite===========================

app.post("/get-fav-list", async (req, res) => {
  const { user } = req.body;

  const { data: fav, error } = await supabase
    .from('Favorite')
    .select('Id,Restaurant(*)')
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

app.delete("/delete-fav", async (req, res) => {
  const { user, restaurant } = req.body;
  
  const { error } = await supabase
  .from('Favorite')
  .delete()
  .eq('UserId', user)
  .eq('RestaurantId', restaurant);
        
  if (error) {
    res.status(400).json(error);
  }
  else {
      res.status(200).json({'msg': "delete user's fav restaurant successfully"});
  }
});

// ===========================home===========================

app.get("/allrestaurant", async (req, res) => {
  let { data, error } = await supabase.from('typerestaurant').select("*")
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

// ===========================profile - restaurant===========================

app.put("/editprofile", async (req, res) => {
  const { RestaurantId, Name, Contact, OpenTime, CloseTime, Location, Latitude, Longitude, BusinessDay } = req.body;
  let { data, error } = await supabase.from('Restaurant')
    .update({
      Name,
      Contact,
      OpenTime,
      CloseTime,
      Location,
      Latitude,
      Longitude,
      BusinessDay
    })
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

app.put("/editmenu", async (req, res) => {
  const { Id, TypeID, NameFood, Price } = req.body;
  const { data, error } = await supabase.from("Menu").update({ TypeID, NameFood, Price }).eq("Id", Id).select();
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json(data);
  }
});

app.get("/showmenu", async (req, res) => {
  const {RestaurantId} = req.body;
  const { data, error } = await supabase.from("Menu").select('NameFood,Type(Name),Price').eq("RestaurantId", RestaurantId);
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json(data);
  }
});

app.get("/showinfo", async (req, res) => {
  const { RestaurantId, Name, Contact, OpenTime, CloseTime, Location, Latitude, Longitude, BusinessDay } = req.body;
  const { data, error } = await supabase.from("Restaurant")
  .select('Name,Contact, OpenTime, CloseTime, Location, Latitude, Longitude, BusinessDay')
  .eq("RestaurantId", RestaurantId);
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json(data);
  }
app.post("/verify-OTP", async (req, res) => {
    const { email,OTP} = req.body;

    const { data: { session }, error } = await supabase.auth.verifyOtp({
        email: email,
        token: OTP,
        type: 'email',
      });
      if (error) {
        res.status(400).json(error);
      } else {
        res.status(200).json({"insert data to table user": session})
      }
});

app.post("/add-account-info", async (req, res) => {
  const { role,user
    ,Name, Contact, OpenTime, CloseTime, Location, Latitude, Longitude, BusinessDay
   } = req.body;
    if (role === 'customer' || role == 'owner'){
      const { data, error } = await supabase.from('User').insert([{ Id: user, Role: role }]).select("*");
      if (error) {
          res.status(400).json(error);
      }
      else {
        
        if (role === 'owner'){
          const { restaurant_data, error } = await supabase.from('Restaurant').insert([{ RestaurantId: user, Name: Name, 
            Contact: Contact, OpenTime: OpenTime, CloseTime: CloseTime, 
            Location: Location, Latitude: Latitude, Longitude: Longitude, 
            BusinessDay: BusinessDay 
          }]).select("*")
          if (error) {
              res.status(400).json(error);
          }
          else {
            console.log(restaurant_data)
            res.status(200).json("insert restaurant data to table user successfully")
          }
        } else {
          res.status(200).json({"insert custommer data to table user successfully": data})
        }
      }
    } else {
      res.status(400).json('wrong role');
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