const KOArouter = require('koa-router');
const request = require('request');
const validator = require('../libs/validator');
let crypto = require('crypto');
const router = new KOArouter({
    prefix: '/share'
});
router.get('/wx', async (ctx,next)=>{
    let acctoken = await validator.getAccessToken();
    let nonceStr = 'Wm3WZYTPz0wzccnW';
    let timestamp = Math.round(new Date().getTime()/1000);
    let url = ctx.query.url;
    console.log(url)
    let ticket = await new Promise((resolve)=>{
        request.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${acctoken.access_token}&type=jsapi`,function (error, response, body) {
            resolve(JSON.parse(response.body))
        });
    });
    console.log(ticket['ticket'])
    let str = `jsapi_ticket=${ticket['ticket']}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
    let hash = crypto.createHash('sha1');
    console.log(str)
    hash.update(str);
    ctx.status = 200;
    ctx.body = {
        nonceStr: nonceStr,
        timestamp: timestamp,
        signature: hash.digest('hex'),
        ticket: ticket['ticket']
    };
});

module.exports = router;