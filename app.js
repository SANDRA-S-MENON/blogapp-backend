const express =require("express")
const mongoose=require("mongoose")
const cors = require("cors")
const bcryptjs=require("bcryptjs")
const {blogmodel} = require("./models/blog")
mongoose.connect("mongodb+srv://sandras02:sandrasmenon@cluster0.3g103sn.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")
const app=express()
app.use(cors())
app.use(express.json())
const jwt=require("jsonwebtoken")


const generateHashedpassword=async (password)=>{
    const salt=await bcryptjs.genSalt(10)
     return bcryptjs.hash(password,salt)
}
// api for signup

app.post("/signup",async(req,res)=>{
    let input = req.body
    let hashedpassword=await generateHashedpassword(input.password)

    console.log(hashedpassword)
    input.password = hashedpassword
    let blog= new blogmodel((input))
    blog.save()
    res.json({"status":"success"})
})
// api for sign in

app.post("/signin",async(req,res)=>{
   let input=req.body
   blogmodel.find({"emailid":req.body.emailid}).then(
    (response)=>{
        if (response.length>0) {
            let dbpassword = response[0].password
            console.log(response)
            bcryptjs.compare(input.password,dbpassword,(error,isMatch)=>{
                if (isMatch) {
                 jwt.sign({email:input.emailid},"blog-app",{expiresIn:"1d"},(error,token)=>{
                    if (error) {
                        res.json({"status":"unable to create token"})
                        
                    } else {
                        res.json({"status":"success",userId:response[0]._id,"token":token})
                    }
                 }) 



                } else {
                    res.json({"status":"incorrect"})
                }
            })
            
        } else {
            res.json({"status":"user does not exist"})
        }
    }
   ).catch()
})


app.listen(8080,()=>{
    console.log("server started")
})