const logger = require('../util/logging/winston').log;
const util = require('../util/utils')
const mft = require('../apis/MFTAPI')
const mftApi = new mft()


async function checkCookie (req, res, next){
    const {JSESSIONID} = req.signedCookies;
    const userName = 'goliveir'
    const password = 'welcome1'
    const auth = 'Basic ' + Buffer.from(userName + ':' + password).toString('base64');
    req.cookies.auth = auth
    
  if (JSESSIONID !== '' && JSESSIONID !== undefined) {
    logger.info("Getting JSESSIONID from cookies.")
    next()
  } else {
    logger.info("Getting JSESSIONID from login api.")
    // const userName = '00054093'
    // const password = 'Welcome1'

    const cookie = await mftApi.logIn(userName, password)
    let options = {
      maxAge: 1000 * 60 * 20, // would expire after 15 minutes
      httpOnly: false, // The cookie only accessible by the web server
      signed: true // Indicates if the cookie should be signed
  }
    req.signedCookies.JSESSIONID = cookie;

    res.cookie('JSESSIONID',cookie, options)
    next()
  }
}

module.exports = checkCookie


// async function checkCookie (req, res, next){
//   const {JSESSIONID} = req.cookies;
//   const userName = 'goliveir'
//   const password = 'welcome1'
//   const auth = 'Basic ' + Buffer.from(userName + ':' + password).toString('base64');
//   req.cookies.auth = auth
// // if (JSESSIONID !== '' && JSESSIONID !== undefined) {
// if (false) {
//   logger.info("Getting JSESSIONID from cookies.")
//   next()
// } else {
  
//   logger.info("Getting JSESSIONID from login api.")
//   const cookie = await mftApi.logIn(userName, password, req, res)
//   res.cookie('JSESSIONID', cookie)
//   req.cookies.JSESSIONID = cookie


//   next()
// }
// }

// module.exports = checkCookie
