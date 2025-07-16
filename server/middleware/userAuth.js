import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
         if(tokenDecode.id)
            {
                if (!req.body) req.body = {}; // Ensure req.body exists
                req.body.userId = tokenDecode.id;
            }   
            else{
                return res.status(401).json({ success: false, message: "Not authorized login again" });
            }     
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}

export default userAuth;