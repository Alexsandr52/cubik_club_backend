require('dotenv').config()
const fingerprint = require('express-fingerprint')
const express = require('express');

const PORT = process.env.PORT || 8080;

// routers
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.router');

// app
const app = express()

app.use(express.json())
app.use('/api', userRouter)
app.use('/api/auth', authRouter)

app.use(fingerprint({ parameters: [fingerprint.useragent, fingerprint.acceptHeaders], }));

const start = async () => {
   try {
      app.listen(PORT, () => console.log(`server started on port ${PORT}`))
   } catch (e) {
      console.log(e);
   }
}

start()


