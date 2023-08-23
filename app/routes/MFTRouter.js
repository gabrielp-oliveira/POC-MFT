"use strict";
const logger = require('../util/logging/winston').log;
const express = require('express');
const router = express.Router();
const mft = require('../apis/MFTAPI')
const mftApi = new mft()
const checkCookie = require('../middleware/checkCookie')
const downloadService = require('../services/download')

router.get('/list', checkCookie, async (req, res) => {
    try {   
        logger.info('start list request.') 
        const token = req.cookies.JSESSIONID;
        const list = await mftApi.getList(token)
        logger.info('end list request.')
        return res.send(list)
    } catch (error) {
        console.error(error);
        logger.error("Error List request.")    
    }
})
router.get('/download', checkCookie, async (req, res) => {
    try {
        logger.info('start download request.')

        const {txt} = req.query
        const download = await mftApi.download(txt, req, res)
        const pdfName = txt.split('.')[0] + '.pdf'
        res.setHeader('Content-Disposition', `attachment; filename=${pdfName}`);
        res.setHeader('Content-Type', 'application/pdf');

        logger.info('end download request.')

        return await downloadService( download, res)
    } catch (error) {
        console.error(error);
        logger.error("Error download request.")
        }
})

module.exports = router;

