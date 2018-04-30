require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');

const util = require('utils/util.js');

const service = {
    init: function() {
        this.query('');
        this.bindEvent();
    },
    bindEvent: function() {
        let _this = this;
        $('#prePage').click(function() {
            let data = {
                pageNum: parseInt($.trim($('#curPage').html())) - 1
            }
            if($(this).hasClass('disabled'))
                return;
            _this.query(data);
        });
        $('#nextPage').click(function() {
            let data = {
                pageNum: parseInt($.trim($('#curPage').html())) + 1
            }
            if($(this).hasClass('disabled'))
                return;
            _this.query(data);
        });
        $('#submit').click(function() {
            let data = {
                pageNum: $.trim($('#pageNum').val())
            }
            _this.query(data);
        });
    },
    query: function(data) {
        let _this = this;
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/user/list.do'),
            data: data,
            doSuccess: function(json, msg) {
                _this.showData(json);
            },
            doError: function(errMsg) {
                alert(errMsg)
            }
        });
    },
    showData: function(json) {
        let users = json.list;
        $('.table tr:gt(0)').remove();
        for(let i = 0; i < users.length; i++) {
            $tr = $('<tr></tr>');
            $tr.append('<td>' + users[i].username + '</td>');
            $tr.append('<td>' + users[i].email + '</td>');
            $tr.append('<td>' + users[i].phone + '</td>');
            let date = new Date(users[i].createTime);
            $tr.append('<td>' + util.dateToStr(date) + '</td>');
            $('.table').append($tr);
        }
        $('.myPage .active > a').html(json.pageNum);
        util.showPage(json);
    },
}

$(function() {
    service.init();
});