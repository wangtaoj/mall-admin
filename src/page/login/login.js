require('./style.css');

const $ = require('jquery');
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
                
                window.location.href = decodeURIComponent(util.getParam(window.location.href, 'redirect')) || './index.html';
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