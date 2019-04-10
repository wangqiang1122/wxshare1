let crypto = require('crypto');
let Token = 'zRiMoAwfOnSN3stZBTOYPYhuVqfH6kr4';
let Wxconfig = require('../Wxconfig');
const https = require('https');
const url = require('url');
const token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${Wxconfig.appID}&secret=${Wxconfig.appsecret}`;

exports.check = function (query) {
    const { signature, echostr, timestamp, nonce } = query;
        // 对签名进行字典排序
   let arr = [Token,timestamp,nonce];
    arr.sort();
    // 进行散列算法先创建哈希对象
    let hash = crypto.createHash('sha1');
    hash.update(arr.join('')); // 必须是字符串
    let hsahVal = hash.digest('hex');
    return hsahVal === signature;
};


// 获取token
exports.getAccessToken = function () {
    return new Promise((resolve, reject)=>{
        let req = https.request(url.parse(token_url),(res)=>{
            let arr = [];
            //console.log(res.statusCode);
           // console.log(res.headers);

            res.on('data',(str)=>{
                arr.push(str)
            });
            res.on('end',()=>{
                let buffer = Buffer.concat(arr);
                resolve(JSON.parse(buffer.toString()))
            })
        });
        req.on('error',function (err) {
            console.log(err)
        });
        req.write('');
        req.end();
    })

};
