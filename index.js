const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const userRouter = require('./routes/User.Routes.js')
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors())
// const usermod = require('./models/User.Model.js')


app.get('/', (req, res)=>{
    res.send("Welcome to Backend")
})




app.use('/api/user/register', userRouter)
app.use('/api/book/login', userRouter)
app.use('/api/user/forgot-password', userRouter)


// app.post('/login', async (req, res)=>{
//     try {

//         const {email, password} = req.body
//         usermod.findOne({email: email})
//             .then(user=>{
//                 if(user){
//                     if(user.password === password){
//                         res.json("Login Successful")
//                     }else{
//                         res.json("password incorrect")
//                     }
//                 }else{
//                     res.json("No record found")
//                 }
//             })
        
        
//     } catch (error) {

//         res.status(500).json({message: error.message})
        
//     }
// })




app.listen(3001, (req, res)=>{
    console.log("Server is running at 3001")

})






mongoose.connect("mongodb+srv://innocentgideon10:3ZLvA0eOOuBt6bYJ@raven.rfyzjjk.mongodb.net/?retryWrites=true&w=majority&appName=Raven")
.then(()=>{
    console.log("Connection Successful")

})

.catch(()=>{
    console.log("Connection Failed!")
})