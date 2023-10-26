"use strict";
const logger = require("../util/logging/winston").log;
const express = require("express");
const router = express.Router();
const mft = require("../apis/MFTAPI");
const mftApi = new mft();
const checkCookie = require("../middleware/checkCookie");
const util = require("../util/utils");

router.post("/list", checkCookie, async (req, res) => {
  try {
    logger.info("start list request.");
    const { JSESSIONID } = req.signedCookies;
    const { sort } = req.body;

    const list = await mftApi.getList(JSESSIONID);
    logger.info("end list request.");

    const response = await util.parseStringIntoList(list.data);
    if (sort[0].direction == "ASC") {
     return res.send(util.sortByProperty(response, sort[0].column, true))
    }else{
      return res.send(util.sortByProperty(response, sort[0].column, false))

    }
    
  } catch (error) {
    console.error(error);
    logger.error("Error List request.");
  }
});
router.get("/download", checkCookie, async (req, res) => {
  try {
    logger.info("start download request.");

    const { txt } = req.query;
    const download = await mftApi.download(txt, req, res);
    // const pdfName = txt.split('.')[0] + '.pdf'
    // res.setHeader('Content-Disposition', `attachment; filename=${pdfName}`);
    // res.setHeader('Content-Type', 'application/pdf');

    logger.info("end download request.");

    // return await downloadService( download, res)
    return res.send(download);
  } catch (error) {
    console.error(error);
    logger.error("Error download request.");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await mftApi.logIn(username, password);
    let options = {
      maxAge: 1000 * 60 * 20, // would expire after 15 minutes
      httpOnly: false, // The cookie only accessible by the web server
      signed: true, // Indicates if the cookie should be signed
    };

    res.cookie("JSESSIONID", result.trim(), options);
    return res.send(true);
  } catch (error) {
    console.log(error);
    return res.send(false);
  }
});
router.post("/uploadFiles", async (req, res) => {
  try {
    logger.info("-----start upload request.");

    const { storeNbr, docList } = req.body;
    console.log(docList)
    
    return res.send(true);
  } catch (error) {
    console.log('error ->>>>>>',error);
    return res.status(404).send('Error');
    
  }
});

router.get("/getFormatOptions", checkCookie, async (req, res) => {
  logger.info("start getFormatOptions request.");
  const { JSESSIONID } = req.signedCookies;

  const listString = await mftApi.getList(JSESSIONID);
  const listFormated = await util.parseStringIntoList(listString.data);

  const response = listFormated.map((listFormated) => listFormated.format);
  logger.info("end getFormatOptions request.");
  return res.send(await response);
});
module.exports = router;
