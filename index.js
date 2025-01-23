const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {swaggerDocs, swaggerUi} = require('./swagger.js')
dotenv.config();
const userRouter = require('./routes/User.Routes.js')
<<<<<<< HEAD
const ChildRouter = require('./routes/Child.Routes.js')
const guardian = require('./routes/guardian.Routes.js')
const privacy = require('./routes/guardian.Routes.js')
const Achievement = require('./routes/Achievement.js')
const Milestone = require ('./routes/milestone.js')
const dashboard = require('./routes/dashboard.js')
=======
// const ChildRouter = require('./routes/Child.Routes.js')
>>>>>>> origin/main
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors())
// const usermod = require('./models/User.Model.js')


app.get('/', (req, res)=>{
    res.send("Welcome to Backend")
})

app.use('/api-docs', swaggerUi.serve, 
    swaggerUi.setup(swaggerDocs, {explorer: true})
);

app.get('api/dashboard', dashboard)


app.use('/api/user/forgot-password', userRouter)
app.use('/api/user/otp', userRouter)

app.post('/api/signin', userRouter)
app.post('/api/signup', userRouter),

<<<<<<< HEAD
app.post('/api/child', ChildRouter)
app.put('api/update', ChildRouter)
app.delete('api/delete', ChildRouter)


app.post('api/add', Achievement)
app.put('api/update', Achievement)
app.delete('api/delete', Achievement)



app.post('api/add-milestone', Milestone)



app.post('api/invite-guardian', guardian)
app.delete('api/delete-guardian', guardian)

app.put('api/privacy', privacy)
app.get('api/privacy-childId', privacy)
=======
// app.post('/api/child', ChildRouter)



>>>>>>> origin/main




app.listen(3001, (req, res)=>{
    console.log("Server is running at 3001")

});

mongoose.connect("mongodb+srv://peenly:peen2024@cluster0.k87ta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Connection Successful")

})

.catch(()=>{
    console.log("Connection Failed!")
})