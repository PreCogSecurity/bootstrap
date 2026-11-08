/*!
 * Bootstrap's npm shrinkwrap helper
 * http://getbootstrap.com
 * Copyright 2013-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict';

var fs = require('fs');
var path = require('path');

var source = path.join(__dirname, '..', 'npm-shrinkwrap.json');
var destination = path.join(__dirname, 'npm-shrinkwrap.json');

if (!fs.existsSync(source)) {
  console.error('Missing npm-shrinkwrap.json. Run `npm shrinkwrap` first.');
  process.exit(1);
}

// renameSync does not replace an existing file on Windows, so remove the
// previous shrinkwrap before moving the freshly generated one into place.
if (fs.existsSync(destination)) {
  fs.unlinkSync(destination);
}

fs.renameSync(source, destination);
console.log('Moved npm-shrinkwrap.json to grunt/npm-shrinkwrap.json');
