class CommonFunction {

    formatAsianNumber = num => {
        let [int, dec = '00'] = (+num).toFixed(2).split('.');
        if (int.length > 3) {
          let start = int.slice(0, int.length - 3);
          let end = int.slice(-3);
          start = start.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
          int = start + ',' + end;
        }
        return `${int}.${dec}`;
      };

      truncateString = (str, maxLength) => {
        if (!str) return "";
        return str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str;
    };
      

}

const commonFunction = new CommonFunction();

export default commonFunction;