const dotenv=require('dotenv');
const moongose=require('mongoose');
process.on("uncaughtException",(err)=>{
    console.log("Uncaught Exception!Shutting Down");
    console.log(err.name,err.message);
    process.exit(1);
})
dotenv.config({path:"./config.env"})

const app=require('./app');
moongose.connect(process.env.DB).then(()=>{
    console.log("DB connection successful");
}).catch((err)=>{
    console.log(err);
})
const port=process.env.PORT || 3000;
const server=app.listen(port,()=>{
    console.log(`App running on ${port}`);
});

process.on("unhandledRejection",(err)=>{
    console.log("UNHANDLE Rejection! Shutting Down");
    console.log(err.name,err.message);
   server.close(()=>{
    process.exit(1);
   });
});