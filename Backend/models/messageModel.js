import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: {
    type: Date, // Store formatted date string instead of Date object
    default: () => new Date(),
  }
});

messageSchema.index({ createdAt:1}, { expireAfterSeconds: 2592000 }); // 30 days 

const messageModel = mongoose.models.Messages || mongoose.model("Messages", messageSchema)

export default messageModel



// default: () => {
//       const date = new Date().toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata",
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: false,
//       });

//       // Format to your pattern: D:M:H d-m-Y
//       const [dmy, time] = date.split(', ');
//       const [day, month, year] = dmy.split('/');
//       const [hour, minute, second] = time.split(':');
//       return `${hour}:${minute}:${second} ${day}-${month}-${year}`;
//     }