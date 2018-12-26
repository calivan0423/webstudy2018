var mysql      = require('mysql');
var db = mysql.createConnection({
    host     : 'calivan.ctk1nynf5quj.us-east-2.rds.amazonaws.com',
    port     : '3300',
    user     : 'calivan',
    password : 'youngjun423!',
    database : 'calivan'
  });
//modul.exports = client;

  exports.login=function(id,pw,callback){
      db.query('SELECT * FROM calivan.users_table where user_id=? AND user_password =?',[id,pw],function(error,result,fields){
        //console.log(result);
        if(result!=0){
            db.query('UPDATE users_table SET user_recent_date = NOW() WHERE user_id= ?',[id]);
        }
        callback(error,result);
      });
    }
      //에이비씨디이에프지

//실험중

  exports.idcheck=function(id,callback){
      db.query('SELECT * FROM calivan.users_table where user_id = ?',[id],callback);
    
  }

  
  exports.join = function(id,pw,nick,email,callback){
     // var data= new Date().toLocaleDateString('se').replace(/\D/g, '')
      //var sign_date=new Date().toISOString().slice(0, 10).replace('T', ' ');
      db.query('INSERT INTO calivan.users_table(user_id,user_password,user_nickname,user_email,user_sign_date,user_recent_date,user_image_path,user_withdraw,user_withdraw_date) VALUES(?,?,?,?,NOW(),NOW(),0,0,0)',[id,pw,nick,email],function(error,result,fields){
          console.log(result);
           callback(error,result);
      });
  }

  exports.getuser = function(callback) {
      db.query('select * from users_table', callback);
  }

