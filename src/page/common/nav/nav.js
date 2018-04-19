/*
 * @Author: wangtao 
 * @Date: 2018-04-19 12:37:09 
 * @Last Modified by:   wangtao 
 * @Last Modified time: 2018-04-19 12:37:09 
 */
const $ = require('jquery');
const service = {
    init: function() {
        this.switchColor();
    },
    //给导航条的当前条目着色
    switchColor: function() {
        let keys = new Map();
        keys.set('index', 0);
        keys.set('category-list', 1);
        keys.set('product-list', 2);
        keys.set('order-list', 3);
        
        let url = window.location.href;
        let key = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
        $('.clickColor').eq(keys.get(key)).addClass('active');
    }
}
$(function() {
    service.init();
});