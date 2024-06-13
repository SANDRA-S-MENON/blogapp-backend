const express =require("express")
const mongoose=require("mongoose")
const cors = require("cors")
const bcryptjs=require("bcryptjs")
const {blogmodel} = require("./models/blog")
mongoose.connect("mongodb+srv://sandras02:sandrasmenon@cluster0.3g103sn.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")
const app=express()
app.use(cors())
app.use(express.json())


const generateHashedpassword=async (password)=>{
    const salt=await bcryptjs.genSalt(10)
     return bcryptjs.hash(password,salt)
}

app.post("/signup",async(req,res)=>{
    let input = req.body
    let hashedpassword=await generateHashedpassword(input.password)

    console.log(hashedpassword)
    input.password = hashedpassword
    let blog= new blogmodel((input))
    blog.save()
    res.json({"status":"success"})
})


app.listen(8080,()=>{
    console.log("server started")
})