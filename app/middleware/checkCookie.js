const logger = require('../util/logging/winston').log;
const util = require('../util/utils')
const mft = require('../apis/MFTAPI')
const mftApi = new mft()


async function checkCookie (req, res, next){
    const {JSESSIONID} = req.cookies;
  if (JSESSIONID !== '' && JSESSIONID !== undefined) {
    logger.info("Getting JSESSIONID from cookies.")
    next()
  } else {
    logger.info("Getting JSESSIONID from login api.")
    const userName = '00054093'
    const password = 'Welcome1'
    const cookie = await mftApi.logIn(userName, password, req, res)
    res.cookie('JSESSIONID', cookie)
    req.cookies.JSESSIONID = cookie

    next()
  }
}

module.exports = checkCookie