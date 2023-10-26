const formatList = ["PDF", "XLS", "CSV","PSV","TXT","ZIP","PIPE","XLSX", "PNG", "LSX"]
const util = {
  getStringBetweenStrings(inputString, startString, endString) {
    const startIndex = inputString.indexOf(startString);
    if (startIndex === -1) {
      return null; // Start string not found
    }

    const endIndex = inputString.indexOf(
      endString,
      startIndex + startString.length
    );
    if (endIndex === -1) {
      return null; // End string not found
    }

    const result = inputString.substring(
      startIndex + startString.length,
      endIndex
    );
    return result;
  },

  parseStringIntoList(text) {
    let initialIndex = 0;
    if (text == "") {
      return [];
    }

    const files = text.split("\r\n");
    const response = files.map((file) => {
      const breakLinePosition = text.indexOf("\r\n", initialIndex);

      lastIndex = breakLinePosition;
      const fileFormat = this.getTextBetweenIndices(
        file,
        file.length - 3,
        file.length
      ).trim();
      const fileName = this.getTextBetweenIndices(
        file,
        file.lastIndexOf("\t"),
        file.length - 4
      ).trim();

      const isFolder = formatList.find((element) => element == fileFormat.toUpperCase());

      if(isFolder == undefined){
        return undefined
      }
      const idx = text.indexOf("."+fileFormat, initialIndex);
      const creationDate = new Date(this.getTextBetweenIndices(file, 0, 22).replace(
        /[^\d.-:- -]/g,
        ""
      ));
      initialIndex = idx + 4; // Avança após a ocorrência de ".txt"
      return { fileName, creationDate, format: fileFormat.toUpperCase(), fileNameAndFormat: fileName +  ".",fileFormat};
    });
    const result = response.filter((file) => file !== undefined);
    return result;
  },

  getTextBetweenIndices(text, startIndex, endIndex) {
    if (startIndex < 0) startIndex = 0;
    if (endIndex > text.length) endIndex = text.length;
    if (startIndex > endIndex) return ""; // Handle invalid indices

    return text.substring(startIndex, endIndex);
  },

  getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  },


  sortByProperty(array, property, reverse = false) {
    return array.sort((a, b) => {
    let valueA = a[property];
      let valueB = b[property];

      if (valueA instanceof Date && valueB instanceof Date) {
          valueA = valueA.getTime();
          valueB = valueB.getTime();
      }

        let comparison = 0;
        if (valueA < valueB) {
            comparison = -1;
        } else if (valueA > valueB) {
            comparison = 1;
        }

        return reverse ? comparison * -1 : comparison;
    });
}

}
module.exports = util;
