const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const generateOTP = require("../jobs/generateOTP");

/**
 * @description Send verification email
 * @param {String} userEmail Receiver email
 * @param {String} userFirstName Receiver first name
 * @async
 */
const sendVerificationMail = async (userEmail, userFirstName) => {
  try {
    const OTP = generateOTP();

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({
      refresh_token: process.env.REFRESH_URI,
    });

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "mailme.kaveen@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_URI,
        accessToken,
      },
    });

    const mailOptions = {
      from: `Trodden <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Registration Verification for Trodden",
      html: `<h1>Hi ${userFirstName}, Welcome to Trodden</h1><p>To verify you as a Nomad, please enter the following code in the Trodden application</p><p>Your code is: <h3>T-${OTP}</h3></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    if (!info)
      throw new Error(
        "Couldn't send the verification email, Something went wrong!"
      );
    return { result: { response: info.response, otp: OTP }, success: true };
  } catch (error) {
    return {
      result: "Error at mailing service " + error.message,
      success: false,
    };
  }
};

module.exports = {
  sendVerificationMail,
};
