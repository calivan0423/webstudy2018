var express = require('express');
var http = require('http');
var controller = require('./controller/logincontroller');
var app = express();
var dao = require('./dao/index')
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
});
var session=require('express-session');
var bcrypt = require('bcrypt-nodejs');

var bodyParser = require('body-parser'); 
//bodyparser(-->post request를 처리)을 사용하기 위해서
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('views engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret : "secret key",
    //비밀키를 지정
    resave : false,
    saveUninitialized : true,
}));


app.get('/', function(req, res){
    if(req.session.username){
        res.redirect('/main')
    }
    else{
    res.render('./LoginForm.html');
    }
});

app.get('/main',function(req,res){
    res.render('./main.html');
})

app.get('/getUserInfo', (req, res) => {
    dao.getuser((err, rows)=> {
        res.send(rows);
    });
    
   //res.render('./user.html');
});


app.post('/',function(req, res){
    
    /*
    var req_mem_id = req.body.id;
    var req_mem_pw = req.body.password;
    */
   
    var body= req.body;
        controller.login(body.id,body.password,function(result){

            if(result=='1'){
                req.session.username=body.id; 
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

app.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(err)console.error('err',err);
        res.send('<script>alert("로그아웃되었습니다!");location.herf="/";</script>');
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

app.post('/main',function(req,res){
    console.log('call logout');
    if(req.session.username){
        console.log("logout");
        req.session.destroy(
            function(error){
                if(error){
                    console.log('에러 발생');
                    return ;
                }
                console.log('삭제성공');
                res.redirect('/');
            }
        );
    }
    else{
        console.log('로긴안되어있음');
        res.redirect('/');
    }
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




