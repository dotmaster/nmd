#!/usr/bin/env node
/*
 * MarkdownParser
 *
 * Simplified BSD License (@see License)
 * @author        Gregor Schwab
 * @copyright     (c) 2010 Gregor Schwab
 * Usage Command Line: ./node-markdown-cli fileName A ... (@see Readme.md)
 * @requires optimist, node-markdown
 */
var sys = require('sys');
var constants = require('constants');
var md = require("node-markdown").Markdown;
var path=require('path'), fs=require('fs');
var command=process.ARGV[1];
var lastPath=path.basename(command);
var argv = require('optimist').usage('Usage: $0 filenameA [filenameB ... -o fileNameOutA -o fileNameOutB]').argv;
var cl=true; //command line
//console.log(sys.inspect((/.*nmd/).test(argv['$0']), false, 20));
if (!((/.*nmd/).test(argv['$0']))) {var cl=false;} //if not called from commandline
if(cl){
  //argv.o normalization
  //if there is only one argument inr argv.o optimist doesn't create an array
  if(typeof argv.o == 'string') var tmp = argv.o; argv.o=[];argv.o[0]=tmp;
  //console.log(sys.inspect(argv, false, 20));
  if (argv.help || argv._[0]=="/?"||!(argv._.length)){console.log('Usage: '+argv.$0+' filenameA [filenameB ... -o fileNameOutA -o fileNameOutB]')}
  new MarkdownParser().parse(argv._, argv.o);
}

module.exports = MarkdownParser;
function MarkdownParser(){
  var logging=false; //set to true to turn on logging
  var log=function(){if(logging)console.log('MarkdownParser', sys.inspect(arguments));}
  
  this.parse=function parse(fileArr, outArr, callback){
    //console.log(sys.inspect(fileArr, false, 20), sys.inspect(outArr, false, 20));
    // Relative or absolute path
    function respondError(msg, context) {
      if (msg.errno===constants.ENOENT) {console.log('ERROR: no such file \"'+ msg.path + '\" perhaps you wanted to use option -o');}
      else console.log("Error: "+sys.inspect(msg));
      //throw new Error("MarkdownParser Error: "+msg);
    }    

    fileArr.forEach(function(fileName, index, fileArr){ 
      try {        
        //input = path.join(__dirname, path.basename(fileName));
        input=fileName;
        log("parsing: "+input); 
        fs.stat(input, function (err, stats) {
          if (err) {
              return respondError(err);
          }
          log("stats: "+sys.inspect(stats)); 
          fs.open(input, 'r', stats.mode, function (err, fd) {
            if (err) return;
            fs.read(fd, stats.size, 0, "utf8", function (e, data) {
              if (e) {
                return respondError(e)
              }
              log("data: "+sys.inspect(data)); 
              var html = md(data);
              log("html: "+sys.inspect(html));              
              handleResponse(html);
            });
          });//end fs.open                       
          function handleResponse(html){
            writeToFile(html)
          }

          function writeToFile(html){//write the file to disk
            var buf=new Buffer(html, encoding='utf8');
            var outputName = outArr[index]; //if ther is only one argument inr argv.o optimist doesn't create an array
            if( outputName ){outputName=outputName.replace(/([^\.]+)$/,'html')}
            else {
              outputName=input.replace(/([^\.]+)$/,'html')              
            }
            log(argv.o instanceof Array, sys.inspect(argv), outputName)
            fs.open(outputName, 'w', stats.mode, function (e, fd) {
              fs.write(fd, buf, 0, buf.length, 0, function(err, written){
                if (err) {
                  respondError(err)
                }
                fs.close(fd, function(err){
                  if (err) {
                    respondError(err)
                  }                       
                })
              })
            })        
          }
        })//end fs.stat
      }catch(e){
        respondError(e);
      }//end try..catch        
    })//end forEach

    
    if (!cl && callback) callback();
  }//end parse
}
       

