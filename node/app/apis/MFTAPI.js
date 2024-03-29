const axios = require("axios");
const logger = require('../util/logging/winston').log;
const util = require('../util/utils')
const {env} = require('../config/environment.json')
class MftApi {
  constructor() {}

  async getList(oldCookie) {
    logger.info("Calling get list api.")
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://mft${env}.cswg.com/list`,
        headers: { 
          "Cookie": `JSESSIONID=${oldCookie}`
        }
      };
      
      const result = await axios.request(config);
      return result;
    } catch (error) {
      console.error(error);
      logger.error("Error get List API.")   
    }
  }

  async logIn(username, password) {
    try {
      logger.info("Calling login api.")
      
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://mft${env}.cswg.com/login?username=${username}&password=${password}`,
          };

      const result = await axios.request(config);
      const cookie = (result.headers['set-cookie'][0])
      const JSESSIONID = util.getStringBetweenStrings(cookie, 'JSESSIONID=', ';' )

      return JSESSIONID;
    } catch (error) {
      console.error(error);
      logger.error("Error login API.")

    }
  }
  async download(txt, req, res) {
    try {
        
      const Oldcookie = req.cookies.JSESSIONID;

      logger.info("Calling download api.")
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://mft${env}.cswg.com/download/${txt}`,
            headers: {
                Authorization: req.cookies.auth,
                Cookie: Oldcookie,
            },
        };
        const result = await axios.request(config);
        const cookie = (result.headers['set-cookie'][0])
        const JSESSIONID = util.getStringBetweenStrings(cookie, 'JSESSIONID=', ';' )
        res.cookie('JSESSIONID', JSESSIONID)

        return result.data;
    } catch (error) {
      console.error(error);
      logger.error("Error download API.")
    }
  }
}


module.exports = MftApi;
