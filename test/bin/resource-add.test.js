const exec = require('child_process').exec;
const taction = require('../../controllers/resource/add');

describe('resource add Script Test Cases', function () {
  describe('Primary resource add Test Case', function () {
    it('Primary resource add Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bin/fleet-resource-add ";
      let params = [];
      _.each(Object.keys(taction.inputs), function (key) {
        if(key != "mode") {
          params.push("--" + key + " " + taction.inputs[key].type);
        }
      });
      command += params.join(" ");
      let results = exec(command, function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          done(err);
        }
        else {
          console.log(stdout);
        }
      });
      results.on('exit', function (code) {
        done(code);
      });
    });
  });
});
