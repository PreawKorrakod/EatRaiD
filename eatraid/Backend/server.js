const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { v4: uuid4 } = require("uuid");
const multer = require("multer");
const upload = multer();
const session = require("express-session");
const e = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use((req, res, next) => {
  // console.log('Session:', req.session);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3300;

const supabaseUrl = "https://gemuxctpjqhmwbtxrpul.supabase.co";
const supabaseKey = process.env.ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ===========================user management===========================

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) {
    const errorMessage = error.toString();
    if (errorMessage.includes("cannot be used as it is not authorized")) {
      res
        .status(400)
        .json({ message: "This email already register. Please try again." });
    } else {
      res.status(200).json({ message: errorMessage });
    }
  } else {
    let { data: User, error: find_error } = await supabase
      .from("User")
      .select("*")
      .eq("Email", email);

    if (error) {
      res.status(200).json({ message: find_error });
    } else {
      if (User.length != 0) {
        res
          .status(400)
          .json({ message: "This email already register. Please try again." });
      } else {
        res.status(200).json({ message: "go to verify page", data: data });
      }
    }
  }
});

app.post("/user-profile", upload.single("file"), async (req, res) => {
  const file = req.file;
  const {user} = req.body;

  const newminetype = "image/jpeg";
  const newfilename = `profile_${user}_${uuid4()}.jpeg`;
  if (file) {
    const { data: files, error } = await supabase.storage.from("Profile").list();

    if (error) {
      console.error(error);
    } else {
      const fileToDelete = files.find(file => file.name.startsWith(`profile_${user}`));
      
      if (fileToDelete) {
        await supabase.storage.from("Profile").remove([fileToDelete.name]);
      }
    }

    const { data: updateData, error: uploadError } = await supabase.storage
      .from("Profile")
      .upload(newfilename, file.buffer, {
        contentType: newminetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;
    const ProfilePic = `https://gemuxctpjqhmwbtxrpul.supabase.co/storage/v1/object/public/${updateData.fullPath}`;
    res.status(200).json({ profile: ProfilePic });
  } else {
    res.status(400).json();
  }
})

app.post("/verify-OTP", async (req, res) => {
  const { email, OTP, role, user, profilePic
    , Name,  OpenTimeHr, CloseTimeHr, OpenTimeMin, CloseTimeMin, Location, Latitude, Longitude, BusinessDay, Tel, Line } = req.body;
    // console.log(email, OTP, role, user, profilePic
    //   , Name,  OpenTimeHr, CloseTimeHr, OpenTimeMin, CloseTimeMin, Location, Latitude, Longitude, BusinessDay, Tel, Line)

  const { data: { session }, error } = await supabase.auth.verifyOtp({
    email: email,
    token: OTP,
    type: "email",
  });
  if (error) {
    res.status(400).json({ error: error, msg: "Wrong OTP. Try again." });
  } else {
    if (role == "customer") {
      const { data, error } = await supabase
        .from("User")
        .insert([{ Id: user, Role: role, ProfilePic: null, Email: email }])
        .select("*");
      if (error) {
        res
          .status(500)
          .json({ error, message: "Error while insert user data" });
      } else {
        res
          .status(200)
          .json({
            message: "insert custommer data to table user successfully",
            data: data,
          });
      }
    } else if (role == 'owner') {
      const { data, error } = await supabase.from('User').insert([{ Id: user, Role: role, ProfilePic: profilePic, Email: email }]).select("*");
      if (error) {
        res.status(500).json({error, message: "Error while insert user data"});
      }
      else {
        console.log('owner')
            const { ownerData, error } = await supabase.from('Restaurant').insert([{
              RestaurantId: user, Name: Name,
              OpenTimeHr: OpenTimeHr,CloseTimeHr: CloseTimeHr, OpenTimeMin: OpenTimeMin, CloseTimeMin: CloseTimeMin,
              Location: Location, Latitude: Latitude, Longitude: Longitude,
              BusinessDay: BusinessDay, Tel: Tel, Line: Line
            }]).select("*")
            if (error) {
              const { error: delete_error } = await supabase
                .from("User")
                .delete()
                .eq("Id", user);
              if (delete_error) {
                res.status(500).json({
                  "error to delete data": delete_error,
                  "error to insert reataurant data data": error,
                });
              } else {
                res
                  .status(500)
                  .json({
                    message: "error while inserting data so delete error data",
                    error: error,
                  });
              }
            } else {
              res
                .status(200)
                .json({
                  message:
                    "insert restaurant data without profile picture successfully",
                  user: data,
                  restaurant: ownerData,
                });
            }
        }
    } else {
      res.status(500).json({ message: "wrong role" });
    }
  }
});

app.post("/resend-OTP", async (req, res) => {
  const { email } = req.body;
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
  });

  if (error) {
    res.status(400).json({ error: error, msg: "Error while resend OTP" });
  } else {
    res.status(200).json({ message: "Resend OTP successfully" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return res
      .status(401)
      .json({ message: "Login failed", error: error.message });
  }

  const user = data.user;
  req.session.userId = user.id;
  console.log("User ID from session:", req.session.userId); // ตรวจสอบค่า userId
  return res.status(200).json({
    message: "Login successful",
    session: req.session,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

app.post("/logout", async (req, res) => {
  console.log("Session before logout:", req.session);
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Error logging out" });
      }
      res.clearCookie("connect.sid", { path: "/", sameSite: "lax" });
      console.log("Session after logout:", req.session);
      return res.status(200).json({ message: "Logout successful" });
    });
  } else {
    return res.status(400).json({ message: "No active session" });
  }
});

app.get("/user", async (req, res) => {
  console.log("User ID from session:", req.session.userId);

  if (!req.session.userId) {
    return res.status(401).json({ msg: "User not authenticated" });
  }
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("Id", req.session.userId);
  if (error) {
    return res.status(500).json({ msg: error.message });
  }

  return res.status(200).json(data);
});

// ===========================home===========================

app.get("/allrestaurant", async (req, res) => {
  let { data, error } = await supabase.from("typerestaurant").select("*");
  if (error) {
    res.status(500).json(error);
  } else {
    res.status(200).json(data);
  }
});

// ===========================profile - restaurant===========================

app.put("/editprofile", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const {
      id,
      RestaurantId,
      Name,
      Contact,
      OpenTime,
      CloseTime,
      Location,
      Latitude,
      Longitude,
      BusinessDay,
    } = req.body;
    const newminetype = "image/jpeg";
    const newfilename = `profile_${id}_${uuid4()}.jpeg`;
    const { data: RestaurantData, dataerror } = await supabase
      .from("Restaurant")
      .update({
        Name,
        Contact,
        OpenTime,
        CloseTime,
        Location,
        Latitude,
        Longitude,
        BusinessDay,
      })
      .eq("RestaurantId", RestaurantId)
      .select("*");
    if (dataerror) return res.status(500).json({ dataerror });
    if (file) {
      const { data: ProfileData, error: fetchError } = await supabase
        .from("User")
        .select("ProfilePic")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }
      if (!ProfileData) {
        throw new Error("Post not found.");
      }
      const imagePath = ProfileData.ProfilePic.split("/").pop();
      await supabase.storage.from("Profile").remove([imagePath]);
      const { data: updateData, error: uploadError } = await supabase.storage
        .from("Profile")
        .upload(newfilename, file.buffer, {
          contentType: newminetype,
          upsert: true,
        });
      if (uploadError) throw uploadError;
      else {
        const ProfilePic = `https://gemuxctpjqhmwbtxrpul.supabase.co/storage/v1/object/public/${updateData.fullPath}`;
        const { Picdata, Picdataerror } = await supabase
          .from("User")
          .update({ ProfilePic })
          .eq("id", id)
          .select("*");
        if (Picdataerror) return res.status(500).json({ Picdataerror });
        return res.status(200).json({ Picdata });
      }
    } else {
      return res.status(200).json({ RestaurantData, Picdata });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// app.put("/editprofile", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     const {
//       id,
//       RestaurantId,
//       Name,
//       Contact,
//       OpenTime,
//       CloseTime,
//       Location,
//       Latitude,
//       Longitude,
//       BusinessDay,
//     } = req.body;
//     const newminetype = "image/jpeg";
//     const newfilename = `profile_${id}_${uuid4()}.jpeg`;
//     const { data: RestaurantData, dataerror } = await supabase
//       .from("Restaurant")
//       .update({
//         Name,
//         Contact,
//         OpenTime,
//         CloseTime,
//         Location,
//         Latitude,
//         Longitude,
//         BusinessDay,
//       })
//       .eq("RestaurantId", RestaurantId)
//       .select("*");
//     if (dataerror) return res.status(500).json({ dataerror });

//     const { data: UserData, error: fetchError } = await supabase
//       .from("User")
//       .select("ProfilePic")
//       .eq("Id", RestaurantId)
//       .single();

//       if (fetchError) {
//         throw fetchError;
//       }
//       if (!ProfileData) {
//         throw new Error("Post not found.");
//       }
//       const imagePath = ProfileData.ProfilePic.split("/").pop();
//       await supabase.storage.from("Profile").remove([imagePath]);

//       const { data: updateData, error: uploadError } = await supabase.storage
//         .from("Profile")
//         .upload(newfilename, file.buffer, {
//           contentType: newminetype,
//           upsert: true,
//         });

//       if (uploadError) throw uploadError;
//       else {
//         const ProfilePic = `https://gemuxctpjqhmwbtxrpul.supabase.co/storage/v1/object/public/${updateData.fullPath}`;
//         const { Picdata, Picdataerror } = await supabase
//           .from("User")
//           .update({ ProfilePic })
//           .eq("id", id)
//           .select("*");
//         if (Picdataerror) return res.status(500).json({ Picdataerror });
//         return res.status(200).json({ Picdata });
//       }
//     } else {
//       const ProfilePic = oldProfilePic;
//       const { data, error } = await supabase.from("User").update({ ProfilePic }).eq("Id", RestaurantId).select("*");
//       if (error) return res.status(500).json({ error });
//       return res.status(200).json({data, RestaurantData});
//     }
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

app.post("/addmenu", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { RestaurantId, NameFood, Price, TypeID } = req.body;
    const newminetype = "image/jpeg";
    const newfilename = `Menu_${RestaurantId}_${uuid4()}.jpeg`;
    const { data: PicData, error: uploadError } = await supabase.storage
      .from("Menu")
      .upload(newfilename, file.buffer, {
        contentType: newminetype,
      });
    if (uploadError) throw uploadError;
    else {
      const MenuPic = `https://gemuxctpjqhmwbtxrpul.supabase.co/storage/v1/object/public/${PicData.fullPath}`;
      const { data, error } = await supabase
        .from("Menu")
        .insert([{ RestaurantId, NameFood, Price, TypeID, MenuPic }])
        .select("*");
      if (error) throw error;
      res.status(200).json({ data });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.put("/editmenu", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    const { id, type, name, price } = req.body;
    console.log(req.body);
    const newminetype = "image/jpeg";
    const newfilename = `Menu_${id}_${uuid4()}.jpeg`;

    const { data: MenuData, error: fetchError } = await supabase
      .from("Menu")
      .select("MenuPic")
      .eq("Id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }
    if (!MenuData) {
      throw new Error("Post not found.");
    }

    const oldMenuPic = MenuData.MenuPic;
    const imagePath = oldMenuPic.split("/").pop();

    if (file) {
      await supabase.storage.from("Menu").remove([imagePath]);

      const { data: updateData, error: uploadError } = await supabase.storage
        .from("Menu")
        .upload(newfilename, file.buffer, {
          contentType: newminetype,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const img = `https://gemuxctpjqhmwbtxrpul.supabase.co/storage/v1/object/public/${updateData.fullPath}`;

      const { data, error } = await supabase
        .from("Menu")
        .update({ TypeID: type, NameFood: name, Price: price, MenuPic: img })
        .eq("Id", id)
        .select("*");

      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(200).json(data);
      }
    } else {
      // return res.status(400).json({ msg: "No file uploaded" });
      const img = oldMenuPic;
      const { data, error } = await supabase
        .from("Menu")
        .update({ TypeID: type, NameFood: name, Price: price, MenuPic: img })
        .eq("Id", id)
        .select("*");

      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(200).json(data);
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/showmenu", async (req, res) => {
  const { RestaurantId } = req.query;
  const { data, error } = await supabase
    .from("Menu")
    .select("Id,RestaurantId,NameFood,Type(Name),TypeID,Price,MenuPic")
    .eq("RestaurantId", RestaurantId);
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json(data);
  }
});

app.delete("/deletemenu", async (req, res) => {
  const { id } = req.body;

  const { data: MenuData, error: fetchError } = await supabase
    .from("Menu")
    .select("MenuPic")
    .eq("Id", id)
    .single();

  const imagepath = MenuData.MenuPic.split("/").pop();
  console.log(imagepath);

  await supabase.storage.from("Menu").remove([imagepath]);

  if (fetchError) {
    throw fetchError;
  }
  if (!MenuData) {
    throw new Error("Post not found.");
  }

  if (!req.session.userId) {
    return res.status(401).json({ msg: "User not authenticated" });
  } else {
    const { error } = await supabase
      .from("Menu")
      .delete()
      .eq("RestaurantId", req.session.userId)
      .eq("Id", id);

    if (error) {
      res.status(400).json(error);
    } else {
      res.status(200).json({ msg: "delete menu successfully" });
    }
  }
});


app.get("/category", async (req, res) => {
  const { data, error } = await supabase.from("Type").select("*");
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json(data);
  }
});

app.get("/showinfo", async (req, res) => {
  const {
    RestaurantId,
    Name,
    Contact,
    OpenTime,
    CloseTime,
    Location,
    Latitude,
    Longitude,
    BusinessDay,
  } = req.body;
  const { data, error } = await supabase
    .from("Restaurant")
    .select(
      "Name,Contact, OpenTime, CloseTime, Location, Latitude, Longitude, BusinessDay"
    )
    .eq("RestaurantId", RestaurantId);

  if (error) {
    res.status(500).json({ error });
  } else {
    // ดึงเฉพาะข้อมูล ProfilePic จาก infoData.User
    const modifiedData = data.map((infoData) => ({
      ...infoData,
      ProfilePic: infoData.User?.ProfilePic, // ดึง ProfilePic จาก User
    }));

    res.status(200).json(modifiedData);
  }
});

// ===========================favorite===========================

app.get("/get-fav-list", async (req, res) => {
  console.log("User ID from session:", req.session.userId);
  if (!req.session.userId) {
    return res.status(401).json({ msg: "User not authenticated" });
  } else {
    const { data: fav, error } = await supabase
      .from("Favorite")
      .select("RestaurantId,Restaurant(Name),User(ProfilePic)")
      .eq("UserId", req.session.userId)
      .order("Id", { ascending: true });
    if (error) {
      res.status(400).json(error);
    } else {
      res.status(200).json(fav);
    }
  }
});

app.get("/get-fav-restaurant", async (req, res) => {
  const { RestaurantId } = req.query;
  const { data, error } = await supabase.from('Favorite').select("*").eq('RestaurantId', RestaurantId);
  if (error) {
    res.status(500).json(error);
  }
  else {
    res.status(200).json(data);
  }
});

app.post("/add-to-fav", async (req, res) => {
  const { user, restaurant } = req.body;
  console.log(user, restaurant);
  const { data, error } = await supabase
    .from("Favorite")
    .insert([{ RestaurantId: restaurant, UserId: user }])
    .select();

  if (error) {
    res.status(400).json(error);
  } else {
    res.status(200).json(data);
  }
});

app.delete("/delete-fav", async (req, res) => {
  const { restaurant } = req.body;
  if (!req.session.userId) {
    return res.status(401).json({ msg: "User not authenticated" });
  } else {
    const { error } = await supabase
      .from("Favorite")
      .delete()
      .eq("UserId", req.session.userId)
      .eq("RestaurantId", restaurant);

    if (error) {
      res.status(400).json(error);
    } else {
      res
        .status(200)
        .json({ msg: "delete user's fav restaurant successfully" });
    }
  }
});

// ===========================test===========================

app.delete("/delete-user", async (req, res) => {
  const { user } = req.body;
  const { data, error } = await supabase.auth.admin.deleteUser(user);
  if (error) {
    res.status(400).json(error);
  } else {
    res.status(200).json(data);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
