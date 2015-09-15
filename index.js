var fs = require('fs');
var path = require('path');
module.exports = function(robot) {
  var scriptsPath = path.resolve(__dirname, 'scripts');
  fs.exists(scriptsPath, function(exists)  {
    if (exists) {
      fs.readdirSync(scriptsPath).forEach(function(file) {
        robot.loadFile(scriptsPath, file);
      });
    }
  });
};
