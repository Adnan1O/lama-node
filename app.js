let express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const user = require('./routes/api/user')
const projects = require('./routes/api/projects')
const chatbot = require('./routes/api/chatbot')
const app = express();
app.use(cors({ origin: "*" }));
app.use(
  express.json({
    limit: "1mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use('/api', user)
app.use('/api', projects)
app.use('/api', chatbot)

const mongodb = process.env.MONGODB;
mongoose.connect(mongodb)
  .then(() => console.log('Connected!'))
  .catch((error)=>{
    console.log("connection failed",error)
  })

  const port = process.env.PORT || 5001;
  app.listen(port, ()=>console.log(`server connected to ${port}`))


