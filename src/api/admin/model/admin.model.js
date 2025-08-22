const { hashPlainText } = require("@/utils/security/hash.utils");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;

(async ()=>{
    const admin = await adminModel.findOne({}).lean();
    if(admin){
       console.log("Admin already exists.") 
    }else {
        const newAdmin = new adminModel({
            fullName : "Admin",
            email : "admin@gmail.com",
            password : await hashPlainText("Admin@1234")
        })
        await newAdmin.save();
        console.log("Admin saved successfully")
    }
})()