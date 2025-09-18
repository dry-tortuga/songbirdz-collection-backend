'use strict';

const path = require('path');

const lockfile = require('../../package-lock.json');

const compromised = {
	'ansi-styles': '6.2.2',
	debug: '4.4.2',
	chalk: '5.6.1',
	'supports-color': '10.2.1',
	'strip-ansi': '7.1.1',
	'ansi-regex': '6.2.1',
	'wrap-ansi': '9.0.1',
	'color-convert': '3.1.1',
	'color-name': '2.0.1',
	'is-arrayish': '0.3.3',
	'slice-ansi': '7.1.1',
	color: '5.0.1',
	'color-string': '2.1.1',
	'simple-swizzle': '0.2.3',
	'supports-hyperlinks': '4.1.1',
	'has-ansi': '6.0.1',
	'chalk-template': '1.1.1',
	backslash: '0.2.1',
};

Object.entries(lockfile.packages).forEach(function ([key, value]) {

	const name = path.basename(key);

	if (!(name in compromised)) { return; }

	console.log(name, value.version, value.version === compromised[name]);

});
