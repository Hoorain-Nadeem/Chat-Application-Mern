import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 250,
    },
    photo: {
      type: String,
      default: "",
    },
    mimetype: {
      type: String,
      default: "",
    },
    originalName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// module.exports = mongoose.model("User", userSchema);
const userModal = mongoose.model("User", userSchema);

export default userModal;