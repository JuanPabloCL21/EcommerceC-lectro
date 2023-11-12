const MySqli = require('mysqli');



let conn = new MySqli({
    host: 'localhost', 
    post: 3306,   
    user: 'Pablo', 
    passwd: '159537',
    charset: '', 
    db: 'clectro' 
  });

  let db = conn.emit(false, '');

  module.exports={
    database:db
  };