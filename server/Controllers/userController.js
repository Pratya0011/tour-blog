import User from "../model/userModel.js";
import { config } from 'dotenv'
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

config()

export const getAllUsers = async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).send(
            {
                users
            }
        )
    } catch(error){
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
}

export const signup = async (req,res) => {
    try{
        const {name, email, password, role} = req.body
        const user = await User.findOne({email:email})
        if(user){
            res.status(409).send({
                message:'Email already exists'
            })
        }else{
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const user = new User({
                name:name,
                email:email,
                password:hashedPassword,
                role: role
            })
            const savedUser = await user.save()
            res.status(201).send({
                userID: savedUser._id,
                message:'Signup Successful'
            })
        }
    }catch(err){
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
}

export const login = async(req,res) => {
    try{
        const {email, password} = req.body
        const header = { algorithm: 'HS256', typ: 'JWT' };
        const user = await User.findOne({email:email})
        if(!user){
            res.status(404).send({
                message:'Invalid Email'
            })
        }else{
            bcrypt.compare(password, user.password).then((isPasswordValid)=>{
                if(isPasswordValid){
                    const accessToken = jwt.sign(
                        {jti:user._id},
                        process.env.JWT_SECRET,
                        {expiresIn:"1m",header:header}
                    );
                    const refreshToken = jwt.sign(
                        { jti: user._id },
                        process.env.JWT_REFRESHSECRET,
                        { expiresIn: "30d",header:header }
                      );
                      return res.status(201).send({
                        name: user.name,
                        email:user.email,
                        id: user._id,
                        message: "Login succesfull",
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                      });
                }else{
                        return res.status(403).send({
                            message:'Invalid Password'
                        })
                }
            }).catch(err=>{
                return res.status(403).send({
                     message:'Invalid Password'
                 })
             })
         }
        }catch(err){
            res.status(500).send({
                message:'Internal server error'
            })
        }
    }

    export const forgotPassword = async (req,res) => {
        const {email,password} = req.body
        try{
            const user = await User.findOne({email:email})
            if(!user){
                res.status(404).send({message: 'Invalid Email'})
            }else{
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                user.password = hashedPassword;
                await user.save()
                res.status(201).send({
                    userID: user._id,
                    message:'Password changed Successful'
                })
            }
        }catch(err){
            res.status(500).send({
                message:'Internal Server Error'
            })
        }
    }

export const oauthLogin = async(req,res) => {
    const {clientId} = req.params
    const {name, email, role, picture} = req.body
    try{
        if(!clientId){
            res.status(401).send({
                message: 'Could not login'
            })
        }else{
            const user = await User.findOne({email:email})
            const header = { algorithm: 'HS256', typ: 'JWT' };
            if(user){
                const accessToken = jwt.sign(
                    {jti: user._id},
                    process.env.JWT_SECRET,
                    {expiresIn:"1m",header:header}  
                );
                const refreshSectet = jwt.sign(
                    { jti: user._id },
                    process.env.JWT_REFRESHSECRET,
                    { expiresIn: "30d",header:header }
                );
                res.status(200).send({
                    userId:user._id,
                    message:'Login Successful',
                    accessToken: accessToken,
                    refreshToken: refreshSectet,
                })
            }else{
                const user = new User({
                    name,
                    email,
                    role,
                    picture
                }) 
                const savedUser = await user.save()
                const accessToken = jwt.sign(
                    {userId:savedUser._id},
                    process.env.JWT_SECRET,
                    {expiresIn:"1m"}
                );
                const refreshToken = jwt.sign(
                    { userId: savedUser._id },
                    process.env.JWT_REFRESHSECRET,
                    { expiresIn: "30d" }
                  );
                  res.status(200).send({
                    userId: savedUser._id,
                    message:'Signup successful',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                })
        }
    }
    }catch(err){
        console.log(err)
        res.status(500).send({

            message:err
        })
    }
}