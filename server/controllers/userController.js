import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try{
        const { userId } = req.body;
        if (!userId) {  
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await userModel.findById(userId).select("-password -verifyOtp -verifyOtpExpireAt");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }   
        return res.json({ success: true, 
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
         });
    }
    catch(error) {
        console.error("Error in getUserData:", error);
        return res.json({success: false, message: error.message});
    }
}