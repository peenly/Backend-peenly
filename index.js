const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {swaggerDocs, swaggerUi} = require('./swagger.js')
dotenv.config();
const userRouter = require('./routes/User.Routes.js')
const ChildRouter = require('./routes/Child.Routes.js')
const guardianRouter = require('./routes/guardian')
const privacyRouter = require('./routes/PrivacyRoutes.js')
const AchievementRouter = require('./routes/AchievementRoutes.js')
const milestoneRouter = require('./routes/MilestoneRoutes.js');
const dashboardRouter = require('./routes/dashboardRoutes.js')
const NotificationRouter = require('./routes/notificationRoutes.js')
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors({origin: "http://localhost:3000"}))


app.get('/', (req, res)=>{
    res.send("Welcome to Backend")
})

app.use('/api-docs', swaggerUi.serve, 
    swaggerUi.setup(swaggerDocs, {explorer: true})
);


app.use('/api/user', userRouter)
app.use('/api/child', ChildRouter)
app.use('/api/achievement', AchievementRouter)
app.use('/api/milestone', milestoneRouter)
app.use('/api/guardian', guardianRouter)
app.use('/api/privacy', privacyRouter)
app.use('/api/notification', NotificationRouter)
app.use('/api/dashboard', dashboardRouter)



             












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