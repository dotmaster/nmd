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
var md = require("node-markdown").Markdown;
var path=require('path'), fs=require('fs');
var argv = require('optimist').usage('Usage: $0 filenameA [filenameB ... -o fileNameOutA -o fileNameOutB]').argv;
//console.log(sys.inspect(argv));
if (argv.help || argv._[0]=="/?"||!(argv._.length)){console.log('Usage: '+argv.$0+' filenameA filenameB ...')}
new MarkdownParser().parse(argv._);
function MarkdownParser(){
  var logging=true;
  var log=function(){if(logging)console.log('MarkdownParser', sys.inspect(arguments));}
  
  this.parse=function parse(fileArr, callback){
    // Absolute path
    function respondError(msg) {
      log("Error: "+sys.inspect(msg));
      //throw new Error("MarkdownParser Error: "+msg);
    }    
    try {
      fileArr.forEach(function(fileName, index, fileArr){ 
        //input = path.join(__dirname, path.basename(fileName));
        input=fileName;
        log("parsing: "+input); 
        fs.stat(input, function (err, stats) {
          if (err) {
              return respondError(err);
          }
          log("stats: "+sys.inspect(stats)); 
          fs.open(input, 'r', stats.mode, function (err, fd) {
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

          function writeToFile(html){//write the file as .less.css
              var buf=new Buffer(html, encoding='utf8');
            var outputName="";
            if(!(argv.o instanceof Array) && index==0){outputName=argv.o}
            else if (!(outputName=argv.o[index])){
              outputName=input.replace(/([^\.]*)$/,'html')              
            }
            log(argv.o instanceof Array, argv.o, outputName)
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
      })//end forEach
    }catch(e){
      respondError(e);
    }//end try..catch
    
    if (callback) callback();
  }//end parse
}
       

