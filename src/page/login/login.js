require('./style.css');

const util = require('utils/util.js');
const service = {
    init: function() {
        this.bindEvent();
    },
    bindEvent() {
        let _this = this;
        $('#submit').click(function() {
            let data = {
                username: $.trim($('#username').val()),
                password: $.trim($('#password').val())
            }
            if( _this.checkData(data)) {
                _this.submit(data);
            }
        }); 
    },
    checkData: function(data) {
        if(util.isEmpty(data.username)) {
            alert('请输入用户名');
            return false;
        }
        if(util.isEmpty(data.password)) {
            alert('请输入密码');
            return false;
        }
        return true;
    },
    submit: function(data) {
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/user/login.do'),
            data: data,
            doSuccess: function(json, msg) {
                let redirctUrl = util.getParam(window.location.href, 'redirect');
                if(redirctUrl == null)
                    window.location.href = './index.html';
                else
                    window.location.href = decodeURIComponent(redirctUrl);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    }
}

$(function() {
    service.init();
});