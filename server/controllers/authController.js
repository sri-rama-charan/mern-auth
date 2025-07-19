 
 import bcrypt from 'bcryptjs';
 import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { text } from 'express';
import transporter from '../config/nodemailer.js';
 
 
 
 export const register = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.json({success:false, message: "Missing details"});
    }
    try{
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.json({success: false, message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        })

        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production' ,
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict', // for production, use 'none' to allow cross-site cookies
            maxAge:  7 * 24 * 40 * 60 * 1000 // 7 days
        });

        ///sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL, 
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hello ${name},\n\nThank you for registering with us! We are excited to have you on board. your registered email id is: ${email} \n\nBest regards,\nYour Service Team`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "Registration successful", user: {id: user._id, name: user.name, email: user.email}});

    } catch(error) {
        console.error("Error in registration:", error);

        return res.json({success: false, message:error.message});
    }
 }

 

 export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.json({success: false, message: "Email and password are required"});
    }
    try {
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({success: false, message: "Invalid credentials"});
        }

        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production' ,
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict', // for production, use 'none' to allow cross-site cookies
            maxAge:  7 * 24 * 40 * 60 * 1000 // 7 days
        });

        return res.json({success: true, message: "Login successful", user: {id: user._id, name: user.name, email: user.email}});
    }
    catch(error) {
        console.error("Error in login:", error);
        return res.json({success: false, message: error.message});
    }
 }



 export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {   
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
             'none': 'strict',
        });
        return res.json({success: true, message: "Logout successful"});
    } catch (error) {
        console.error("Error in logout:", error);
        return res.json({success: false, message: error.message});
    }
 }


//send verification OTP
export const sendVerifyOtp = async (req, res) => {
    try{
        const {userId} = req.body
        const user = await userModel.findById(userId);
        if(user.isAccountVerified) {
            return res.json({success: false, message: "Account already verified"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP for account verification is ${otp}. It is valid for 24 hours.`
        }
        await transporter.sendMail(mailOptions);

        res.json({success: true, message: "Verification OTP sent successfully"});
    }
    catch(error) {
        console.error("Error in sending verification OTP:", error);
        return res.json({success: false, message: error.message});
    }
}


//verify email with OTP
export const verifyEmail = async (req, res) => {   
    
    const {userId, otp} = req.body;

    if(!userId || !otp) {
        return res.json({success: false, message: "User ID and OTP are required"});
    }
    
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }

        if(user.isAccountVerified) {
            return res.json({success: false, message: "Account already verified"});
        }

        if(user.verifyOtp !== otp ) {
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP has expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: "Email verified successfully"});
    }
    catch(error) {
        console.error("Error in verifyEmail:", error);
        return res.json({success: false, message: error.message});
    }

}

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try{
        return res.json({success: true, message: "User is authenticated", userId: req.body.userId});
    }
    catch(error) {
        console.error("Error in isAuthenticated:", error);
        return res.json({success: false, message: error.message});
    }
}

export const sendResetOtp = async (req, res) => {
    const {email} = req.body;
    if(!email) {
        return res.json({success: false, message: "Email is required"});
    }
    try{
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}. It is valid for 15 minutes.`
        };
        await transporter.sendMail(mailOptions);
        return res.json({success: true, message: "Reset OTP sent successfully"});
    }
    catch(error) {
        console.error("Error in sendResetOtp:", error);
        return res.json({success: false, message: error.message});
    }
    
}

//reset user password
export const resetPassword = async (req, res) => {
    const {email, otp ,newPassword} = req.body;
    if(!email || !otp || !newPassword) {
        return res.json({success: false, message: "Email, OTP and new password are required"});
    }

    try {
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        if(user.resetOtp ==="" || user.resetOtp !== otp) {
            return res.json({success: false, message: "Invalid OTP"});
        }
        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP has expired"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({success: true, message: "Password reset successfully"});
    }
    catch(error) {
        console.error("Error in resetPassword:", error);
        return res.json({success: false, message: error.message});
    }
}