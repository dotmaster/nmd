#!/usr/bin/env node
var MarkdownParser = require('./nmd');

fileArr = ['Readme.md']
outArr = ['index.html']
new MarkdownParser().parse(fileArr, outArr, function(){console.log('all done')});
