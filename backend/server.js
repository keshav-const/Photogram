// const dotenv=require('dotenv');
// const moongose=require('mongoose');
// process.on("uncaughtException",(err)=>{
//     console.log("Uncaught Exception!Shutting Down");
//     console.log(err.name,err.message);
//     process.exit(1);
// })
// dotenv.config({path:"./config.env"})

// const app=require('./app');
// moongose.connect(process.env.DB).then(()=>{
//     console.log("DB connection successful");
// }).catch((err)=>{
//     console.log(err);
// })
// const port=process.env.PORT || 3000;
// const server=app.listen(port,()=>{
//     console.log(`App running on ${port}`);
// });

// process.on("unhandledRejection",(err)=>{
//     console.log("UNHANDLE Rejection! Shutting Down");
//     console.log(err.name,err.message);
//    server.close(()=>{
//     process.exit(1);
//    });
// });
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });

// const app = require("./app");
// console.log("MongoDB URI:", process.env.DATABASE); // Debugging .env loading
// const User = require("./models/userModel");
// console.log("User Model Registered:", mongoose.models);

// // ✅ Connect to MongoDB
// mongoose
//     .connect(process.env.DATABASE, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log("✅ DB connection successful!");
        
//         // ✅ Start server only when DB is connected
//         const PORT = process.env.PORT || 8000;
//         app.listen(PORT, () => {
//             console.log(`🚀 Server running on port ${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.error("❌ DB Connection Error:", err);
//     });
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

require("./models/userModel");  // ✅ Ensure model is registered before use
require("./models/postModel");

const app = require("./app");

mongoose.connect(process.env.DATABASE)

    .then(() => {
        console.log("✅ DB connection successful!");
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ DB Connection Error:", err);
    });
