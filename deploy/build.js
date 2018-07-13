const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const cmd = process.argv[2]; // node, build, cmd
const root = process.cwd() + '/deploy/uservices';


// it will be `npm run-script build` inside root in the end.
console.log('===================================================================');
console.log(`Performing "npm ${cmd}" inside root folder: ` + root);
console.log('===================================================================');

npmBuildRecursive(root);

function npmBuildRecursive(folder) {
  console.log('NPM Build Recursive: ' + folder);

  for (let subfolder of subfolders(folder)) {
    npmBuildRecursive(subfolder);
  }

  const hasPackageJson = fs.existsSync(path.join(folder, 'package.json'));

  console.log('has package: ' + hasPackageJson);
  if (!hasPackageJson && path.basename(folder) !== 'code') {
    return;
  }

  if (folder !== root && hasPackageJson) {
    console.log('===================================================================');
    console.log(`Performing "npm build" inside ${folder === root ? 'root folder' : './' + path.relative(root, folder)}`);
    console.log('===================================================================');

    npmBuild(folder);
  }

  for (let subfolder of subfolders(folder)) {
    npmBuildRecursive(subfolder);
  }
}

function npmBuild(where) {
  childProcess.execSync('npm run-script ' + cmd, {cwd: where, env: process.env, stdio: 'inherit'});
}

function subfolders(folder) {
  return fs.readdirSync(folder)
    .filter(subfolder => fs.statSync(path.join(folder, subfolder)).isDirectory())
    .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
    .map(subfolder => path.join(folder, subfolder));
}
