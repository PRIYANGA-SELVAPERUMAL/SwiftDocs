const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register user
exports.register = async (req,res) => {
  try{
    const { username, password, role } = req.body;
    const user = await User.create({ username, password, role });
    res.status(201).json({ message: "User registered", user });
  }catch(err){
    res.status(400).json({ message: err.message });
  }
};

// Login user
exports.login = async (req,res) => {
  try{
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};
