const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/User.Routes.js')
const ChildRouter = require('./routes/Child.Routes.js')
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors())
// const usermod = require('./models/User.Model.js')



app.get('/', (req, res)=>{
    res.send("Welcome to Backend")
})




app.post('/api/signin', userRouter)
app.post('/api/signup', userRouter)

app.post('/api/child', ChildRouter)







app.listen(3001, (req, res)=>{
    console.log("Server is running at 3001")

})






mongoose.connect("mongodb+srv://peenly:peen2024@cluster0.k87ta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Connection Successful")

})

.catch(()=>{
    console.log("Connection Failed!")
})