const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app=express();

mongoose.connect('mongodb://localhost:27017/movieappDB');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const userSchema=new mongoose.Schema({
    id:String,
    image:{
      type:String,
      default:'0'
    },
    username:{
     type:String,
     required:true
    },
    email:{
     type:String,
     rrequired:true
    },
    WatchHistory:[],
    password:{
     type:String,
     required:true
    }
})

const User = new mongoose.model("User", userSchema);

app.post("/login", async function(req, res) {
    try {
      const user = await User.findOne({ email: req.body.EmailId}).exec();
      if (user === null) {
        res.send({ success: false });
        console.log("No user found");
      } else {
        const passwordVerification = bcrypt.compareSync(req.body.password, user.password);
        if (passwordVerification) {
          res.send({
            success: true,
            username: user.username,
            id: user._id,
            email: user.email,
            history: user.WatchHistory,
            password: user.password,
            image:user.image
          });
        } else {
          res.send({ success: false });
        }
      }
    } catch (err) {
      console.log(err);
      // Handle the error
    }
  });


  app.post("/addtoWatchList",function(req,res){
  const userEmail = req.body.userEmail;

    User.findOneAndUpdate(
      { email: userEmail },
      {$push: {
          WatchHistory: {
            title:req.body.title,
            posterUrl: req.body.posterUrl,
            releaseYear: req.body.releaseYear,
            type: req.body.type
          }
        }
      },
      { new: true } // This option returns the updated document
    )
    .then(updatedUser => {
      if (!updatedUser) {
        // User not found
        console.log("User not found");
        return res.status(404).json({ error: "User not found" });
      } else {
        res.send({ updatedUser });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Failed to update user" });
    });
  })


  app.post("/signup", function(req, res) {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user !== null) {
          res.send({ success: false });
          console.log("User already exists");
        } else {
          bcrypt.hash(req.body.password, 10, function(err, bHash) {
            const newUser = new User({
              email: req.body.email,
              username: req.body.username,
              password: bHash
            });
            newUser.save();
            res.send({
              success: true,
              username: newUser.username,
              id: newUser._id,
              email: newUser.email,
              history: newUser.WatchHistory,
              password: newUser.password,
              image:newUser.image
            });
            console.log("User successfully signed up");
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

app.post('/ChangeAvatar',function(req,res){
  User.findOneAndUpdate(
    { email:req.body.email},
    { $set: { image: req.body.image} },
    { new: true } // This option returns the updated document
  )
    .then(updatedUser => {
      if (!updatedUser) {
        // User not found
        console.log("user not found");
        return res.status(404).json({ error: "User not found" });
      }
      else{
      res.send({updatedUser});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Failed to update user" });
    });
})

app.post(`/changeusername`,function(req,res){
  User.findOneAndUpdate(
    { email:req.body.email},
    { $set: { username: req.body.username} },
    { new: true } // This option returns the updated document
  )
    .then(updatedUser => {
      if (!updatedUser) {
        // User not found
        console.log("user not found");
        return res.status(404).json({ error: "User not found" });
      }
      else{
      res.send({updatedUser});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Failed to update user" });
    });
  });

  app.post("/changepasswordtonew", function(req, res) {
    bcrypt.hash(req.body.password, 10)
      .then(hashcode => {
        User.findOneAndUpdate(
          { email: req.body.email },
          { $set: { password: hashcode } },
          { new: true } // This option returns the updated document
        )
        .then(updatedUser => {
          if (!updatedUser) {
            // User not found
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
          } else {
            res.send({ updatedUser });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "Failed to update user" });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Failed to hash password" });
      });
  });

app.post('/clearhistory',function(req,res){
  User.findOneAndUpdate(
    { email:req.body.email},
    { $set: { WatchHistory:[]} },
    { new: true } // This option returns the updated document
  )
    .then(updatedUser => {
      if (!updatedUser) {
        // User not found
        console.log("user not found");
        return res.status(404).json({ error: "User not found" });
      }
      else{
      res.send({updatedUser});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Failed to update user" });
    });
});

app.listen(5000, function() {
    console.log("Server started on port 5000");
  });