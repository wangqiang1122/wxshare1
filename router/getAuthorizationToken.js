const router = require('koa-router');
const router2 = router();
let Wxconfig = require('../Wxconfig');
const request = require('request');


router2.get('/getToken', async (ctx)=>{
    let authorization = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${Wxconfig.appID}&secret=${Wxconfig.appsecret}&code=${ctx.query.code}&grant_type=authorization_code`;
    let ticketBody = await new Promise((resolve,reject)=>{
        request.get(authorization,(error, response, body)=>{
            resolve(body);
        })
    })
    ctx.status = 200;
    ctx.body = ticketBody;

});


module.exports = router2.routes();
