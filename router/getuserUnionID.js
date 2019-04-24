const router = require('koa-router');
const router2 = router();
let Wxconfig = require('../Wxconfig');
const request = require('request');

router2.get('/union',async function (ctx) {
    let authorization = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${Wxconfig.appID}&secret=${Wxconfig.appsecret}&code=${ctx.query.code}&grant_type=authorization_code`;
    console.log(authorization)
    let access = await  new Promise(function (resolve,reject) {
        request.get(authorization,(err,response,data)=>{
            resolve(JSON.parse(data))
        })
    });
    console.log(access);
    console.log(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access.access_token}&openid=${access.openid}&lang=zh_CN`)
    let userinfo = await new Promise((resolve,reject)=>{
        request.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access.access_token}&openid=${access.openid}&lang=zh_CN`,(err,response,data)=>{
            console.log(data)
        })
    });
});

module.exports = router2.routes();