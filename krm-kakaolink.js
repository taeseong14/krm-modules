const { KakaoApiService, KakaoLinkClient } = require('kakaolink')

const Kakao = new KakaoLinkClient();


/**
 * @param {string} email 
 * @param {string} pw password
 * @param {string} apikey jskey
 * @param {string} url 
 * @returns {function} krm middleware
 */
module.exports = function (email, pw, apikey, url) {
    KakaoApiService.createService().login({
        email: email,
        password: pw,
        keepLogin: true,
    }).then(e => {
        Kakao.login(e, {
            apiKey: 'apiKey',
            url: 'url'
        });
    }).catch(e => {
        throw e;
    });

    return function (msg, reply, next) {
        reply.kakaolink = function (template_id, template_args, room) {
            Kakao.sendLink(room || msg.room, {
                template_id: template_id,
                template_args: template_args
            });
        }
        next();
    }
}