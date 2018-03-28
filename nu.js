'use strict';
 
const exec = require ( 'child_process' ).exec;
const vnu = require ( 'vnu-jar' );
var spawn   = require('child_process').spawn; 
// Print path to vnu.jar
console.log ( vnu );
 
// Work with vnu.jar
// for example get vnu.jar version
exec ( `java -jar ${vnu} --version`, ( error, stdout ) => {
    if ( error ) {
        console.error ( `exec error: ${error}` );
        return;
    }
    console.log ( stdout );
} );


/*
exec ( `java -jar ${vnu} --format json http://127.0.0.1 `, ( error, stdout ) => {
    if(error)
    {
      console.error ( `exec error: ${error}` );
      return;
    }
    console.log(stdout);
} );

*/

const child = spawn('java',['-jar',`${vnu}`,'--format','json','http://127.0.0.1']);

      child.stdout.on('data', function (data) {
      var str = data.toString('utf8');
      console.log(str);
      });

     child.stderr.on('data', function (data) {
      var str = data.toString('utf8');
      console.log(str);
     });

     child.on('close', function(code) {
     });

    child.on('exit', function(code, signal) {
      console.log('exit');

    });

