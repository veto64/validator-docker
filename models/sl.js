const sql    = require('mssql');
const config = require('../config');

//var server = config.mssql.sl_230;
var server = config.mssql.sl_local;



function get_blocker(callback)
{
  const pool = new sql.ConnectionPool(server);
  const request = new sql.Request(pool);
  pool.connect( (_con_err) => {
    if (_con_err)
    {
      console.log(_con_err);
    }
    request.execute('blocker_get', (err, result) => {
      if(! err)
      {
        callback(result.recordset[0]);
      }
      else
      {
        console.log(err);
      }
      pool.close();
    });
  });
}



module.exports = {
    get_blocker: get_blocker
};

