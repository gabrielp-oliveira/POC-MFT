"use strict";
const http = require('http');
const express = require("express");
const morgan = require('morgan');

const logger = require('./util/logging/winston').log;

const MFTRouter = require('./routes/MFTRouter');
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 1000;

const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
let httpServer;

const fs = require('fs');
const cookieParser = require('cookie-parser');
let wsConfigParams = fs.readFileSync('./config/wsconfig.json'); 
let wsConfigProps = JSON.parse(wsConfigParams);
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';




function initialize() {

    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);
         app.use(morgan('combined'));
         app.use(cors())
         app.use(cookieParser('MY SUPER SECRET HASH'));

       // app.use(morgan('combined', { stream: winston.stream }));
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            next();
        });
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json())
      

        app.use('/mft', MFTRouter);

        httpServer.listen(wsConfigProps.channel_port, err => {
            if (err) {
                reject(err);
                return;
            }
            logger.info(`POC for MFT API(s) listening on port ${wsConfigProps.channel_port}!`);
            console.log(`POC for MFT API(s) listening on port ${wsConfigProps.channel_port}!`);
            resolve();
        });

    });
}
module.exports.initialize = initialize;
async function startup() {
    logger.info('Starting application');
    try {
      logger.info('Initializing web server module');
  
      await initialize();
    } catch (err) {
      console.error(err);
  
      process.exit(1); // Non-zero failure code
    }
  }
  startup();

//  app.listen(8088, () => console.log("Channel API(s) listening on port 8088!"));
