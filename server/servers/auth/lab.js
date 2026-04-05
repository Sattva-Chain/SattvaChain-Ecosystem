import JWT from "jsonwebtoken"
const JWT_SCREATE_KEY = "kwgydvwjyd"
export const  createToken = (user)=>{
const playlaod = {
    _id:user._id,
}

const token = JWT.sign(playlaod,JWT_SCREATE_KEY)
return token;
} 

export const validUser = (token)=>{
    const pyload = JWT.verify(token,process.env.JWT_SCREATE_KEY)
    return pyload 
}