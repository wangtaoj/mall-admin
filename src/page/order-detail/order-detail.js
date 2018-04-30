require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');

const util = require('utils/util.js');

const service = {
    init: function () {
        let orderNo = util.getParam(window.location.href, 'orderNo');
        this.query(orderNo);
        this.bindEvent();
    },
    //绑定事件
    bindEvent: function () {

    },
    //查询订单详情
    query: function (orderNo) {
        let _this = this;
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/order/detail.do'),
            data: { 'orderNo': orderNo },
            doSuccess: function (json, msg) {
                _this.showData(json);
            },
            doError: function (errMsg) {
                alert(errMsg);
            }
        });
    },
    //展示数据
    showData: function (orderVo) {
        //头部信息
        $('#createTime').text(orderVo.createTime);
        $('#orderNo').text(orderVo.orderNo);
        $('#status').text(orderVo.statusDesc);
        if (orderVo.shippingVo) {
            $('#userInfo').text(orderVo.shippingVo.receiverName + " " + orderVo.shippingVo.receiverPhone);
            let username = orderVo.shippingVo.receiverName;
            let address = orderVo.shippingVo.receiverProvince + orderVo.shippingVo.receiverCity
                + orderVo.shippingVo.receiverDistrict + orderVo.shippingVo.receiverAddress
            let phone = orderVo.shippingVo.receiverPhone;
            let content = username + "<br/>" + address + "<br/>" + phone;
            //初始化弹出框, 当鼠标悬浮时显示, 鼠标离开时消失
            $('#userInfo').popover({
                animation: true,
                container: 'body',
                title: '',
                html: true,
                content: content,
                placement: 'bottom',
                trigger: 'hover',
            });
        }
        $('#totalPrice').text("￥" + orderVo.payment + "元");
        $('#payStyle').text("/ " + orderVo.paymentTypeDesc);

        //商品信息
        let products = orderVo.orderItemVoList;
        $('#orderDetail tr:gt(0)').remove();
        if (products != null) {
            for (i = 0; i < products.length; i++) {
                let $tr = $('<tr></tr>');
                let imgUrl = orderVo.imageHost + products[i].productImage;
                $tr.append("<td class='center'><img width='60' height='60' src='" + imgUrl + "'></img></td>");
                $tr.append("<td class='center'>" + products[i].productName + "</td>");
                $tr.append("<td class='center'>" + products[i].currentUnitPrice + "</td>");
                $tr.append("<td class='center'>" + products[i].quantity + "</td>");
                $tr.append("<td class='center'>" + products[i].totalPrice + "</td>");
                $('#orderDetail').append($tr);
            }
        }

    }
}

$(function () {
    service.init();
});