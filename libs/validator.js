let crypto = require('crypto');
let Token = 'zRiMoAwfOnSN3stZBTOYPYhuVqfH6kr4';
let Wxconfig = require('../Wxconfig');
const https = require('https');
const url = require('url');
const token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${Wxconfig.appID}&secret=${Wxconfig.appsecret}`;
const request = require('request');
let AccessToken = ''; // 缓存token用
// 网络授权token

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
        next(resolve)
        function next(resolve) {
            if (AccessToken!=='') {
                resolve(AccessToken)
            } else {
                let req = https.request(url.parse(token_url),(res)=>{
                    let arr = [];

                    res.on('data',(str)=>{
                        arr.push(str)
                    });
                    res.on('end',()=>{
                        let buffer = Buffer.concat(arr);
                        AccessToken=(JSON.parse(buffer.toString()));
                        next(resolve)
                    })
                });
                req.on('error',function (err) {
                    console.log(err)
                });
                req.write('');
                req.end();
            }
        }
    })

};
 // 获取网络授权
exports.getAuthorization = function (code) {
    let authorization = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${Wxconfig.appID}&secret=${Wxconfig.appsecret}&code=${code}&grant_type=authorization_code`;
    console.log(authorization)
    return new Promise((resolve, reject)=>{
        let req = https.request(url.parse(authorization),(res)=>{
            let arr = [];
            //console.log(res.statusCode);
            // console.log(res.headers);
            res.on('data',(str)=>{
                arr.push(str)
            });
            res.on('end',()=>{
                let buffer = Buffer.concat(arr);
                let datastr = JSON.parse(buffer.toString());
                // console.log(buffer.toString())
                request.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${datastr.access_token}&openid=${datastr.openid}&lang=zh_CN`,(error, response, body)=>{
                    // console.log(error);
                    // console.log(response);
                    resolve(JSON.parse(body));
                });
            })
        });
        req.on('error',function (err) {
            console.log(err)
        });
        req.write('');
        req.end();
    })
}
