const nodemailer=require("nodemailer");
const sendEmail=async(options)=>{
    const transporter=nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASS,
        },
    });
    const mailOptions={
        form:"Photogram",
        to:options.email,
        subject:options.subject,
        html:options.html,
    };
    await transporter.sendMail(mailOptions);
}; 
module.exports=sendEmail;