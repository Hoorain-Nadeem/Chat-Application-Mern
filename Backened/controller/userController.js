import userModal from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";


const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed."), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,

});

const register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        status: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters.",
      });
    }

    

    const checkUser = await userModal.findOne({email});

    if (checkUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Optional profile picture
    let photo = "";
    let mimetype = "";
    let originalName = "";

    if (req.file) {
      photo = req.file.buffer.toString("base64");
      mimetype = req.file.mimetype;
      originalName = req.file.originalname;
    }

    // Create user
    const insertObj = new userModal({
      name: name.trim(),
      email,
      password: hashedPassword,
      bio: bio?.trim() || "",
      photo,
      mimetype,
      originalName,
    });

    await insertObj.save();

    return res.status(201).json({
      status: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      status: false,
      message:
        error.code === 11000
          ? "An account with this email already exists."
          : "Something went wrong while registering the user.",
    });
  }
};



let login = async (req, res) => {
  let { email, password} = req.body;
  let User = await userModal.findOne({ email });

  if (!User) {
    return res.send({
      status: false,
      message: "Incorrect email or password",
    });
  }
  let checkPass = await bcrypt.compare(password, User.password);
  if (checkPass) {
    let token = jwt.sign(
      { id: User._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send({
      status: true,
      message: "You are logged in",
      User ,
      token
    });
  } else {
    res.send({
      status: false,
      message: "incorrect email or password",
    });
  }
};
let logout = (req, res) => {
  try {
    res.clearCookie("token");
  return res.send({
    status:true,
    message:"Logout"
  });
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
  
};
let checkAuth = (req, res) => {
  try {
     res.send({
    status:true,
    user:req.user
  });
  } catch (error) {
     res.send({
      status: false,
      message: error,
    });
  }
 

};
export  { register,upload, login, logout, checkAuth };
