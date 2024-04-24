require('dotenv').config()
const express = require('express');

const PORT = process.env.PORT || 8080;

// routers
const userRouter = require('./routes/user.route')

// app
const app = express()

app.use(express.json())
app.use('/api', userRouter)

const start = async () => {
   try {
      app.listen(PORT, () => console.log(`server started on port ${PORT}`))
   } catch (e) {
      console.log(e);
   }
}

start()


