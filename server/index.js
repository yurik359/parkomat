const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const url =
  "mongodb+srv://yurik52222:04291999@cluster0.hge96yf.mongodb.net/parkomat?retryWrites=true&w=majority";
  const cors = require("cors");
  const bodyParser = require('body-parser');
const {checkPayment} = require('./scheduleTasks.js')



  app.use(cors());
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self' 'sha256-CBu0w5uiOaPgb2R6Zgf7E0+STJHF4lcPIdhZzQXE6yk='");
    
    // Другие настройки CSP, если нужно
    next();
  });
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.use(express.static('public'));
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
  app.use(express.json());
  app.use('/',routes)


  

  checkPayment()
  
const start = async () => {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      app.listen(4001, () => {
        console.log("Server started on port 4001");
      });
   
    } catch (error) {
      console.log(error);
    }
  };
  

  

  start();