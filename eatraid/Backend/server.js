const express = require('express');
require("dotenv").config();
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const { v4: uuid4 } = require('uuid');
const multer = require("multer");
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for easy to test with Postman
const port = 3300;

const supabaseUrl = 'https://gemuxctpjqhmwbtxrpul.supabase.co'
const supabaseKey = process.env.ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// ===========================user management===========================

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })
  if (error) {
      res.status(500).json({ message: error.message });
  }
  else {
    let { data: User, error } = await supabase
      .from('User')
      .select("*")
      .eq('Email', email)

    if (error) {
      res.status(500).json({ message: error.message });
    }
    else {
      if (User.length != 0) {
        res.status(400).json({message: 'This email already register. Please try again.'})
      } else {
        res.status(200).json({ message: 'go to verify page', data:data });
      }
    }
  }
});

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
      res.status(200).json({message:"insert data to table user", data: session})
    }
  });

// app.post("/add-account-info", async (req, res) => {
// // app.post("/add-account-info", upload.single("file"), async (req, res) => {
//   // const file = req.file;
//   const { role,user
//     ,Name, Contact, OpenTime, CloseTime, Location, Latitude, Longitude, BusinessDay
//    } = req.body;

   
//   // if (file == undefined) {
//   //   res.status(400).json("no profile picture");
//   // } else {
//       // const newminetype = "image/jpeg";
//       // const newfilename = `profile_${user}.jpeg`;
//       // const { data: updateData, error: uploadError } = await supabase.storage
//       //   .from("Profile")
//       //   .upload(newfilename, file.buffer, {
//       //     contentType: newminetype,
//       //     upsert: true,
//       //   });

//       // if (uploadError) throw uploadError;
//       // else {
//       //   const ProfilePic = `https://gemuxctpjqhmwbtxrpul.supabase.co/storage/v1/object/public/${updateData.fullPath}`;

//         if (role === 'customer' || role == 'owner'){
//           const { data, error } = await supabase.from('User').insert([{ Id: user, Role: role, ProfilePic: null}]).select("*");
//           if (error) {
//               res.status(400).json(error);
//           }
//           else {
            
//             if (role === 'owner'){
//               const { restaurant_data, error } = await supabase.from('Restaurant').insert([{ RestaurantId: user, Name: Name, 
//                 Contact: Contact, OpenTime: OpenTime, CloseTime: CloseTime, 
//                 Location: Location, Latitude: Latitude, Longitude: Longitude, 
//                 BusinessDay: BusinessDay 
//               }]).select("*")
//               if (error) {
//                   const { error: delete_error } = await supabase 
//                     .from('User')
//                     .delete()
//                     .eq('Id', user) ;
//                     if (delete_error) {
//                       res.status(400).json({
//                         "error to delete data": delete_error, 
//                         "error to insert reataurant data data": error});
//                     } else {
//                       res.status(400).json({"error in inserting data so delete error data": error})
//                     }
//               }
//               else {
//                 res.status(200).json({"insert restaurant data to table user successfully": data})
//               }
//             } else {
//               res.status(200).json({"insert custommer data to table user successfully": data})
//             }
//           }
//         } else {
//           res.status(400).json('wrong role');
//         }
//       // }
//   // }
// });

app.post("/add-account-info", async (req, res) => {
    const { role,user, email } = req.body;
  
      if (role === 'customer' || role == 'owner'){
        const { data, error } = await supabase.from('User').insert([{ Id: user, Role: role, ProfilePic: null, Email: email}]).select("*");
        if (error) {
            res.status(400).json(error);
        }
        else {
          res.status(200).json({message: "insert custommer data to table user successfully", data: data})
        }
      } else {
        res.status(400).json({message: 'wrong role'});
      }
  });

app.post("/add-restaurant-info", async (req, res) => {
  const { role,user
    ,Name, Contact, OpenTime, CloseTime, Location, Latitude, Longitude, BusinessDay
    } = req.body;

  const { data, error } = await supabase.from('Restaurant').insert([{ RestaurantId: user, Name: Name, 
    Contact: Contact, OpenTime: OpenTime, CloseTime: CloseTime, 
    Location: Location, Latitude: Latitude, Longitude: Longitude, 
    BusinessDay: BusinessDay 
  }]).select("*")
  if (error) {
      const { error: delete_error } = await supabase 
        .from('User')
        .delete()
        .eq('Id', user) ;
        if (delete_error) {
          res.status(500).json({
            "error to delete data": delete_error, 
            "error to insert reataurant data data": error});
        } else {
          res.status(400).json({message: "error in inserting data so delete error data", error: error})
        }
  }
  else {
    res.status(200).json({message: "insert restaurant data to table user successfully", data: data})
  }
});


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

// ===========================home===========================

app.get("/allrestaurant", async (req, res) => {
  let { data, error } = await supabase.from('typerestaurant').select("*")
  if (error) {
    res.status(500).json(error);
  }
  else {
    res.status(200).json(data);
  }
});

// ===========================profile - restaurant===========================

app.put("/editprofilepicture", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { id } = req.body;
    const newminetype = "image/jpeg";
    const newfilename = `profile_${id}_${uuid4()}.jpeg`;
    const { data: updateData, error: uploadError } = await supabase.storage
      .from("Profile")
      .upload(newfilename, file.buffer, {
        contentType: newminetype,
        upsert: true,
      });
    if (uploadError) throw uploadError;
    else {
      const ProfilePic = `https://gemuxctpjqhmwbtxrpul.supabase.co/storage/v1/object/public/${updateData.fullPath}`;
      console.log(ProfilePic);
      const { data: postData, error: postError } = await supabase.from("User").update({ ProfilePic }).eq("id", id).select();
      if (postError) throw postError;
      res.status(200).json(postData);
      console.log(postData);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

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
  const { RestaurantId } = req.body;
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

// ===========================test===========================

app.delete("/delete-user", async (req, res) => {
  const { user } = req.body;
  const { data, error } = await supabase.auth.admin.deleteUser(
    user
  )
  if (error) {
    res.status(400).json(error);
  }
  else {
    res.status(200).json(data);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));