var express = require('express');
var http = require('http');
var controller = require('./controller/logincontroller');
var app = express();
var dao = require('./dao/index')
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
});
var bodyParser = require('body-parser'); 
//bodyparser(-->post request를 처리)을 사용하기 위해서
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('views engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.get('/', function(req, res){
    res.render('./LoginForm.html');
});

app.get('/main',function(req,res){
    res.render('./main.html');
})

app.get('/getUserInfo', (req, res) => {
    /*dao.getuser((err, rows)=> {
        res.send(rows);
    });
    */
   res.render('./user.html');
});


app.post('/',function(req, res){
	
    var req_mem_id = req.body.id;
    var req_mem_pw = req.body.password;
    
    
    controller.login(req_mem_id,req_mem_pw,function(result){
        console.log(result);
        
        if(result=='1'){
        res.send('<script>alert("로그인 성공");location.href="/main"</script>');        
        }
        else{
            res.send('<script>alert("로그인실패");location.href="/";</script>');
        }
        /*
        res.json({
            result
        })
        */
        
    });
});

app.get('/JoinForm',function(req,res){
    res.render('./JoinForm.html');
});



app.post('/JoinForm',function(req, res){
    var req_id = req.body.id;
    var req_pw= req.body.password;
    var req_nick = req.body.nickname;
    var req_email = req.body.email;

    controller.join(req_id,req_pw,req_nick,req_email,function(result){
        /*res.json({
            result
        })
        */
        if(result == '0'){
            res.send('<script>alert("회원가입 실패");location.href="/JoinForm"</script>');
        }
        else if(result == '1') {
            res.send('<script>alert("회원가입 성공");location.href="/";</script>');
//          res.redirect("/");
        }
    });
}); 


app.get('/idcheck/:id',function(req,res){
    var id = req.params.id;
    console.log(req.params);
    controller.idcheck(id,function(error,result){
        console.log(result);
        if(result!=0){
            res.send(false);
            //중복
        }
        else {
            res.send(true);
            //중복안된 것
        }
        
    })
})
