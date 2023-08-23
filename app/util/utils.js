const  util = {


    getStringBetweenStrings(inputString, startString, endString) {
        const startIndex = inputString.indexOf(startString);
        if (startIndex === -1) {
          return null; // Start string not found
        }
      
        const endIndex = inputString.indexOf(endString, startIndex + startString.length);
        if (endIndex === -1) {
          return null; // End string not found
        }
      
        const result = inputString.substring(startIndex + startString.length, endIndex);
        return result;
      }
}

module.exports = util