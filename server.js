const { readdirSync } = require("fs");
require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');



// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
  })
);
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://fityfits.netlify.app'
  ],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(express.json());
app.use(morgan("dev"))
app.use(cors( corsOptions ));
app.use(xss());
app.use(helmet({crossOriginResourcePolicy: false}))

// error handler
const notFoundMiddleware = require('./middleware/notfound.js');

// routes middleware
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`))) 


// routes
app.get('/', (req, res) => {
  res.send('server is running');
});

//db connection
const connectDB = require('./db/connect.js');


// //if no route found
app.use(notFoundMiddleware);


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();