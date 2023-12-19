import jwt from "jsonwebtoken";
import { config } from "dotenv";

config()

export const authenticateToken = (req,res,next) => {
    let accessToken = req.header("access")
    let refreshToken = req.header("refresh")
    const header = { algorithm: 'HS256', typ: 'JWT' };
    let id = req.params.id

    if(!accessToken){
        return res.status(401).send({message: "Access not allowed"})
    }else{
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
            if(err){
                if( err.name === "TokenExpiredError"){
                    if(!refreshToken){
                        return res.status(401).send({message: "Acess.not allowed"})
                    }else{
                        jwt.verify(refreshToken, process.env.JWT_REFRESHSECRET , (err,user)=>{
                            if(err){
                                return res.status(502).send({
                                    name: err.name,
                                    message: "Session Expired",
                                  });
                            }else{
                                if(user.jti === id){
                                    const newAccessToken = jwt.sign(
                                        { jti: user.jti},
                                        process.env.JWT_SECRET,
                                        { expiresIn: "1m",header:header }
                                      );
                                      res.status(200).send({
                                        accessToken: newAccessToken,
                                        message: "Access Allowed",
                                        id:id
                                      });
                                      next()
                                }else{
                                    return res
                                    .status(401)
                                    .send({ message: "Access not allowed" });
                                  }
                            }
                        })
                    }
                }else {
                    return res.status(500).send({ message: "Access not allowed" });
                  }
            }else {
                if(user.jti ===id){
                  res.status(200).send({
                    accessToken: accessToken,
                    message: "Access Allowed",
                    id:id
                  });
                  next();
                }else{
                  return res.status(500).send({ message: "Access not allowed" });
                }
              }
        })
    }
}