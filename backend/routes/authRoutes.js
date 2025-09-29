const router = require("express").Router();
const User = require("../models/User");

// Simple login
router.post("/login", async (req,res)=>{
  const {username,password} = req.body;
  const user = await User.findOne({username,password});
  if(!user) return res.status(400).json({message:"Invalid credentials"});
  res.json({token:"dummy-token", role:user.role, username:user.username});
});

// Seed users route (testing only)
router.get("/seed", async (req,res)=>{
  await User.deleteMany({});
  await User.create([
    {username:"student1", password:"123", role:"student"},
    {username:"verifier1", password:"123", role:"verifier"},
    {username:"admin1", password:"123", role:"admin"}
  ]);
  res.send("Seeded users");
});

module.exports = router;
