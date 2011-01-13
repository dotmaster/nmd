# Node Markdown command line parser  #

node-markdown-cli is a super simpel parser for node. No strings attached. You can use it from the command line or include it as a module with require('nmd')

## Version ##

please install the latest version >=0.2.2

## Usage from Command line ##

Usage is simple:

    npm install nmd
    
then from the command line

    nmd filename.md (@see --help to get more options)

## Usage as a module##

Usage is simple:

    npm install nmd

    var MarkdownParser = require('./nmd');
    //setup the input file names
    fileArr = ['Readme.md']
    //optionally set up the output filenames
    outArr = ['index.html']
    
    new MarkdownParser().parse(fileArr, outArr, function(){console.log('all done')});


## Dependencies ##

nmd depends on node-markdown and optimist.



## Todos ##

* nothing ;)