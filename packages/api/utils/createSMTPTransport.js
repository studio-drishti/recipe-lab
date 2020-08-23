let nodemailer = require("nodemailer");
let aws = require("aws-sdk");

// configure AWS SDK
aws.config.loadFromPath("config.json");

console.log("This is the region:", aws.config.region);

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  host: "email-smtp.us-west-2.amazonaws.com",
  port: 587,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: "AKIA2O42FPHG5DPAK5ZM",
    pass: "BGI96Jc59bN/HTOqyQ8SxEu3lk+vM6t/pxcMFYyEPRiN",
  },
});

module.exports = {
  transporter,
};
