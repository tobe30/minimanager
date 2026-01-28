import User from "../models/User.js";
import  bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";



export const Register = async (req, res)=> {
        const {username, email, password} = req.body;

        try {
                if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
             return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
        return res.status(400).json({ message: "Email already exists, please use a different one"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
                username,
                email,
                password:hashedPassword
            })

        await newUser.save();

            const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent xss attacks
            secure: false, // only for https, works with ngrok
            sameSite: "lax" // allows cross-site cookies
        
        })
        
        res.status(201).json({success:true, user:newUser})

        } catch (error) {
             console.log("Error in register controller", error);
             res.status(500).json({ message: "Internal Server Error"});
        }
}


export const login = async (req, res)=> {
        try {
            const {email, password} = req.body

            if(!email || !password){
                    return res.status(400).json({ message: "All fields are required"}) 
            }

            const user = await User.findOne({email})
            if(!user) return res.status(401).json({ message: "Invalid email or password"})

            const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
            if(!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password"});

            const token = jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY, {
                expiresIn: "7d",
            })
            console.log(token)

            res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent xss attacks
            secure: false, // only for https, works with ngrok
            sameSite: "lax" // allows cross-site cookies
        
        })

        res.status(200).json({success: true, user});

        } catch (error) {
        console.log("Error in login controller", error.message);
         res.status(500).json({ message: "Internal Server Error"});
        }
}

//logout function
export function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,     
    sameSite: "lax", 
  });
  res.status(200).json({ success: true, message: "Logout successful" });
}

//recommendatio
// const isProduction = process.env.NODE_ENV === "production";

// res.cookie("jwt", token, {
//   maxAge: 7 * 24 * 60 * 60 * 1000,
//   httpOnly: true,
//   secure: isProduction,
//   sameSite: isProduction ? "none" : "lax",
// });
