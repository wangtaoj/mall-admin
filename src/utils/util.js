/**
 * 封装整个项目的通用模块
 */
const $ = require('jquery');
const host = '';
const util = {
    /*
        统一封装ajax请求
        params = {
            type: 请求的类型, get/post
            url: 请求的url
            data: 请求的数据
            doSuccess: 请求成功时, 回调函数调用的业务函数, 处理返回来的数据
            doError: 请求失败时, 回调函数调用的业务函数, 显示错误提示
        }

        res = {
            //后端返回的json数据
            status: 0 | 1 | 10, 
            data: json数据
            msg: 字符串
        } 
    */
    request: function(params) {
        let _this = this;
        $.ajax({
            type: params.type || 'get',
            url: params.url || '',
            data: params.data  || '',
            dataType: "json",
            success: function(res) {
                if(res.status === 0) {
                    //请求成功
                    if(typeof params.doSuccess === 'function')
                        params.doSuccess(res.data, res.msg);
                } else if(res.status === 1) {
                    //后端接口返回失败状态码, 请求失败
                    if(typeof params.doError === 'function')
                        params.doError(res.msg);
                } else if(res.status === 10) {
                    //未登录, 需要登录
                    _this.doLogin();
                }
            },
            error: function(err) {
                if(typeof params.doError === 'function')
                        params.doError(err.statusText);
            }
        });
    },
    doLogin: function() {
        let curUrl = window.location.href;
        window.location.href = '/dist/view/login.html?redirect=' + encodeURIComponent(curUrl);
    },
    getServletUrl: function(uri) {
        return host + uri;
    },
    isEmpty: function(param) {
        if(param == null || param === '')
            return true;
        return false;
    },
    validPhone: function (str) {
        var reg= /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
        return reg.test(str);
    },
    getParam: function(url, key) {
        let i = url.indexOf('?');
        if(i > -1) {
            let paramUrl = url.substring(i + 1);
            let params = paramUrl.split('&');
            for(let i = 0; i < params.length; i++) {
                let j = params[i].indexOf('=');
                if(j > -1) {
                    if(params[i].substring(0, j) === key)
                        return params[i].substring(j + 1);
                }
            }
        }
        return null;
    },
    dateToStr: function(data) {
        return data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + 
        this.fillZero(data.getDate()) + " " + this.fillZero(data.getHours()) + ":" + 
        this.fillZero(data.getMinutes()) + ":" + this.fillZero(data.getSeconds());
    },
    fillZero: function(number) {
        if(number <= 9)
            return '0' + number;
        return number + '';
    },
    showPage: function(json) {
        if(json.hasPreviousPage) {
            $('#prePage').removeClass('disabled');
        } else {
            $('#prePage').addClass('disabled');
        }
        if(json.hasNextPage) {
            $('#nextPage').removeClass('disabled');
        } else {
            $('#nextPage').addClass('disabled');
        }
    }
};

module.exports = util;