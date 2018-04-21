require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');
const $ = require('jquery');
const util = require('utils/util.js');

const service = {
    init: function() {
        this.queryDetail();
    },

    queryDetail: function() {
        let _this = this;
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/product/detail.do'),
            data: {productId: util.getParam(window.location.href, 'id')},
            doSuccess: function(json, msg) {
                _this.showData(json);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    showData: function(json) {
        $('#name').val(json.name);
        $('#subTitle').val(json.subtitle);
        let status = new Map();
        status.set(1, '在售');
        status.set(2, '下架');
        status.set(3, '删除');
        $('#status').val(status.get(json.status));
        $('#category').val(json.categoryName);
        $('#price').val(json.price);
        $('#stock').val(json.stock);
        $('#detail').html(json.detail);
    },
}
$(function() {
    service.init();
});