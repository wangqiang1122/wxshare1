let koa = require('koa');
let server = new koa();
let validator = require('./libs/validator');
let static = require('koa-static');
let Wxconfig = require('./Wxconfig');
const https = require('https');
const url = require('url');
var Router = require('koa-router');
var router = new Router();
let accesstoken = '';
server.listen(80);
// router
server.use(router.routes())

router.get('/token', function (ctx) {
    const { query } = ctx;
    const { echostr } = query;
    // // 对签名进行字典排序
    // let arr = [Token,timestamp,nonce];
    // arr.sort();
    // // 进行散列算法先创建哈希对象
    // let hash = crypto.createHash('sha1');// sha1的散列散列算法
    // hash.update(arr.join('')); // 必须是字符串
    // let hsahVal = hash.digest('hex');
    // if (hsahVal===signature) {
    //     ctx.body =  echostr;
    // }
    if (validator.check(query)){
       ctx.body =  echostr;
    }  else {
        console.log(validator.check(query))
    }
});
// token 获取
// const token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${Wxconfig.appID}&secret=${Wxconfig.appsecret}`;
// let req = https.request(url.parse(token_url),(res)=>{
//     let arr = [];
//      console.log(res.statusCode);
//      console.log(res.headers);
//
//      res.on('data',(str)=>{
//          arr.push(str)
//      });
//      res.on('end',()=>{
//          let buffer = Buffer.concat(arr);
//          console.log(buffer.toString())
//      })
// });
// req.on('error',function (err) {
//      console.log(err)
// });
// req.write('');
// req.end();
async function accessToken() {
    accesstoken = await validator.getAccessToken();
    console.log(accesstoken)

}
accessToken();




// 静态文件托管
server.use(static('www'));