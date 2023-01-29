const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
app.use(express.json())


const users = [
 
    {
        id:"1",
        username:"john",
        password:"John0908",
        isAdmin : true
    },
    {
        id:"2",
        username:"jahn",
        password:"Jahn0908",
        isAdmin : false
    }
 
 

];

app.post("/api/login",(req,res)=>{
    const {username,password} = req.body;
    const user = users.find(u=>{
        return u.username === username && u.password ===password
    });

    if(user){
         
        //Generte and access token
        const accessToken = jwt.sign({id:user.id,isAdmin:user.isAdmin},"mySecretKey")
        
        res.json({
            username:username,
            isAdmin:user.isAdmin,
            accessToken,
        })
 
         

    }else{
        res.status(400).json("Username or password incorrect!")
    }
})



const verify = (req,res,next) =>{
     const authHeader = req.headers.authorization;
     if(authHeader){
       
        const token = authHeader.split(" ")[1];


        jwt.verify(token,"mySecretKey",(err,user)=>{
            if(err){
                return res.status(403).json("Token is invalid")
            }

            req.user=user;
            next();
        })
         


     }else{
        res.status(403).json("You are not authenticate!");
     }
}


app.delete("/api/users/:userid",verify,(req,res)=>{
    if(req.user.id===req.params.userid||req.user.isAdmin){
        res.status(200).json("user has been deleted.")
    }else{
        res.status(403).json("You are not allowed to delete this user")
    }
})


app.listen(5000,()=>{
    console.log("Listening on port 3000")
})