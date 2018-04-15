const shell = require('shelljs');

module.exports = {
   requireExecutable: function (exeName) {
      if (!shell.which(exeName)) {
         throw new Error(`Error: The native executable '${exeName}' was not found on your system but is required to load this application.`);
      }
   }
};
