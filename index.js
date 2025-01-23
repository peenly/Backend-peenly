const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { swaggerDocs, swaggerUi } = require('./swagger.js');
dotenv.config();
const userRouter = require('./routes/User.Routes.js');
const ChildRouter = require('./routes/Child.Routes.js');
const guardian = require('./routes/guardian.Routes.js');
const privacy = require('./routes/guardian.Routes.js');
const Achievement = require('./routes/Achievement.js');
const Milestone = require('./routes/milestone.js');
const dashboard = require('./routes/dashboard.js');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to Backend');
});

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Access the Swagger API documentation.
 *     tags:
 *       - Documentation
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

// Routes
app.use('/api/user/forgot-password', userRouter);
app.use('/api/user/otp', userRouter);
app.use('/api/child', ChildRouter);
app.put('/api/update', ChildRouter);
app.delete('/api/delete', ChildRouter);
app.post('/api/add', Achievement);
app.put('/api/update', Achievement);
app.delete('/api/delete', Achievement);
app.post('/api/add-milestone', Milestone);
app.post('/api/invite-guardian', guardian);
app.delete('/api/delete-guardian', guardian);
app.put('/api/privacy', privacy);
app.get('/api/privacy-childId', privacy);




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