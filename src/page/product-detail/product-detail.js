/*
 * @Author: wangtao 
 * @Date: 2018-05-07 02:15:41 
 * @Last Modified by: wangtao
 * @Last Modified time: 2018-05-07 20:48:16
 */

require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');
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
        $('#subtitle').val(json.subtitle);
        let imgUrls = json.subImages == null || json.subImages=== '' ? [] : json.subImages.split(',');
        for(let i = 0; i < imgUrls.length; i++) {
            this.showImage(json.imageHost + imgUrls[i]);
        }
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
    showImage: function(url) {
        let $img = "<img width='150px' height='150px' src='" + url + "'></img>  ";
        $('#imageArea').append($img);
    },
}
$(function() {
    service.init();
});