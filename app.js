const express = require("express");
const app = express();


var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});
client.on("connect", ()=>{
    console.log("rediska pashet");
});

app.get("/", (req,res,next)=>{
    
    client.set("string key", "string val", redis.print);
    client.hset("hash key", "hashtest 1", "some value", redis.print);
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    client.hkeys("hash key", function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });
    
    res.send("Тестируем редиску");

});

app.get('/set',(req,res,next)=>{
    client.set('myval','Русишь',(err,reply)=>{
        if (err)console.log('error: '+err)
        else{
            res.send('setted '+ reply);
        } 
    });
});

app.get('/get',(req,res,next)=>{
    client.get('myval',(err,reply)=>{
        if (err)console.log('error: '+err)
        else{
            res.send('setted '+ reply);
        }
    });
});

app.get('/obj',(req,res,next)=>{
    client.hmset('frameworks', {
        'javascript': 'AngularJS',
        'css': 'Bootstrap', 
        'node': 'Express'
    });

    client.hgetall('frameworks', function(err, object) {
        console.log(object);
        res.send(object);
    });
});

app.get('/list',(req,res,next)=>{
    //, 'Январь', 'Февраль','Март','Апрель','Май','Июнь','Июль'
    client.exists('Monthes',async function(err, reply) {
        if (reply === 1) {
            console.log('exists');
            await client.del('Monthes');
        } else {
            console.log('doesn\'t exist');
        }
    });

    client.rpush(["Monthes", "Good","Bad","Middle"],async function(err, reply) {
        await console.log(reply); 
    });

    client.lrange('Monthes',0,-1,async (err,reply)=>{
        console.log(reply);
        await res.send(reply);
    });
});



app.listen(8800,(err)=>{
    if (!err)
        console.log("Ура");
});

