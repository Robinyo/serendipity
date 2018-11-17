let replace = require('replace-in-file');

let buildVersion = process.argv[2];

const options = {
  files: [
    'src/environments/environment.ts',
    'src/environments/environment.prod.ts'
  ],
  from: /version: '(.*)'/g,
  to: "version: '"+ buildVersion + "'",
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  console.log('Build version set to: ' + buildVersion);
}
catch (error) {
  console.error(error);
}
