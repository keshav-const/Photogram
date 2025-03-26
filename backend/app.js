// const express=require('express');
// const morgan=require('morgan');
// const helmet=require('helmet');
// const cors=require('cors');
// const cookieParser=require('cookie-parser');
// const mongoSanitize=require('express-mongo-sanitize');
// const path=require('path');
// const AppError = require('./utils/appError');
// const globalerrorhandler=require('./controllers/errorController');
// const userRouter=require('./routes/userRoutes');

// const postRouter=require("./routes/postRoutes");

// const app=express();

// app.use("/",express.static("uploads"));
// app.use(cookieParser());
// app.use(helmet());
// app.use(cors({
//     origin:["http://localhost:3000"],
//     credentials:true,
// }));

// app.use(express.static(path.join(__dirname,"public")));
// if(process.env.NODE_ENV==='development'){
//     app.use(morgan("dev"));
// }
// app.use(express.json({ limit: "50mb" }));  // Increase JSON limit to 50MB
// app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase URL-encoded limit

// app.use(mongoSanitize());


// app.use("/api/v1/users",userRouter);
// app.use("/api/v1/posts",postRouter);

// app.all("*",(req,res,next)=>{
//     next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
// });
// app.use(globalerrorhandler);
// module.exports=app; 
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const fs = require('fs');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const postRouter = require("./routes/postRoutes");

const app = express();

// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/", express.static("uploads"));
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));

app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
}
app.use(express.json({ limit: "50mb" }));  // ✅ Increased limit to support large images
app.use(mongoSanitize());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
