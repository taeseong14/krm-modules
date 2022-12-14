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
    return KakaoApiService.createService().login({
        email: email,
        password: pw,
        keepLogin: true,
    }).then(e => {
        Kakao.login(e, {
            apiKey: apikey,
            url: url
        });
        return function (msg, reply, next) {
            reply.kakaolink = function (template_id, template_args, room) {
                return Kakao.sendLink(room || msg.room, {
                    template_id: template_id,
                    template_args: template_args
                }, 'custom');
            }
            next();
        }
    }).catch(e => {
        throw e;
    });
}