const nodemailer = require("nodemailer");
const generateOTP = require("../jobs/generateOTP");

/**
 * @description Send verification email
 * @param {String} userEmail Receiver email
 * @param {String} userFirstName Receiver first name
 * @async
 */
const sendVerificationMail = async (userEmail, userFirstName) => {
  const OTP = generateOTP();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Trodden <${process.env.GMAIL_USER}>`,
    to: userEmail,
    subject: "Registration Verification for Trodden",
    html: `<h1>Hi ${userFirstName}, Welcome to Trodden</h1><p>To verify you as a Nomad, please enter the following code in the Trodden application</p><p>Your code is: <h3>T-${OTP}</h3></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (!info)
      throw new Error(
        "Couldn't send the verification email, Something went wrong!"
      );
    return { result: { response: info.response, otp: OTP }, success: true };
  } catch (error) {
    return { result: "Error at mailing service " + error.message, success: false };
  }
};

module.exports = {
  sendVerificationMail,
};
