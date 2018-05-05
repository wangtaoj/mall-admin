/*
 * @Author: wangtao 
 * @Date: 2018-04-19 15:35:17 
 * @Last Modified by: wangtao
 * @Last Modified time: 2018-04-30 16:12:19
 */
require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');

const util = require('utils/util.js');

const service = {
    init: function () {
        this.query({});
        this.bindEvent();
    },
    bindEvent: function () {
        let _this = this;
        //分页功能
        $('#prePage').click(function () {
            let data = {
                pageNum: parseInt($.trim($('#curPage').html())) - 1,
                orderNo: $.trim($('#orderNo').val())
            }
            if ($(this).hasClass('disabled'))
                return;
            //如果订单号是空的, 则查询接口
            if (util.isEmpty(data.orderNo))
                _this.query(data);
            else //否则搜索接口
                _this.search(data);
        });
        $('#nextPage').click(function () {
            let data = {
                pageNum: parseInt($.trim($('#curPage').html())) + 1,
                orderNo: $.trim($('#orderNo').val())
            }
            if ($(this).hasClass('disabled'))
                return;
            if (util.isEmpty(data.orderNo))
                _this.query(data);
            else
                _this.search(data);
        });
        $('#submit').click(function () {
            let data = {
                pageNum: $.trim($('#pageNum').val()),
                orderNo: $.trim($('#orderNo').val())
            }
            if (util.isEmpty(data.pageNum)) {
                alert("请输入页码再查询");
            } else {
                if (util.isEmpty(data.orderNo))
                    _this.query(data);
                else
                    _this.search(data);
                $('#pageNum').val('');
            }
        });
        //搜索功能
        $('#search').click(function () {
            let data = { orderNo: $.trim($('#orderNo').val()) };
            if (util.isEmpty(data.orderNo)) {
                alert("请输入订单号再搜索");
            } else {
                _this.search(data);
            }
        });

        //动态绑定发货按钮点击事件
        $('.table').on('click', '.send', function() {
            let data = {orderNo: $(this).attr('name')};
            _this.send(data, $(this).parent());
        });
    },
    query: function (data) {
        let _this = this;
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/order/list.do'),
            data: data,
            doSuccess: function (json, msg) {
                _this.showData(json);
            },
            doError: function (errMsg) {
                alert(errMsg)
            }
        });
    },
    //搜索
    search: function (data) {
        let _this = this;
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/order/search.do'),
            data: data,
            doSuccess: function (json, msg) {
                _this.showData(json);
            },
            doError: function (errMsg) {
                alert(errMsg)
            }
        });
    },
    //发货
    send: function(data, elementTd) {
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/order/send_goods.do'),
            data: data,
            doSuccess: function(json, msg) {
                elementTd.text(msg);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    //展示数据
    showData: function (json) {
        let orders = json.list;
        $('.table tr:gt(0)').remove();
        for (let i = 0; i < orders.length; i++) {
            let $tr = $('<tr></tr>');
            $tr.append('<td>' + orders[i].orderNo + '</td>');
            let name = orders[i].shippingVo == null ? '' : orders[i].shippingVo.receiverName;
            $tr.append('<td>' + name + '</td>');
            let text = orders[i].statusDesc;
            if(orders[i].statusDesc === '已付款') {
                text = text + " <a name='" + orders[i].orderNo + "' class='link send'>发货</a>";
            }
            $tr.append('<td>' + text + '</td>');
            $tr.append('<td>' + orders[i].payment + '</td>');
            $tr.append('<td>' + orders[i].createTime + '</td>');
            $tr.append("<td><a class='link' href='./order-detail.html?orderNo=" + orders[i].orderNo + "'>详情</a></td>");
            $('.table').append($tr);
        }
        $('.myPage .active > a').html(json.pageNum);
        util.showPage(json);
    },
}

$(function () {
    service.init();
});