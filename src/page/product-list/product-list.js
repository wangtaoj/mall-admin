require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');

//const $ = require('jquery');
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
            _this.query(data);
        });
        $('#nextPage').click(function() {
            let data = {
                pageNum: parseInt($.trim($('#curPage').html())) + 1
            }
            _this.query(data);
        });
        $('#submit').click(function() {
            let data = {
                pageNum: $.trim($('#pageNum').val())
            }
            _this.query(data);
        });
        //搜索
        $('#search').click(function() {
            _this.search();
        });
        //详情按钮
        $('#add').click(function() {
            $('#detailDialog').modal({
                backdrop: false,
                show: true
            });
        });
    },
    query: function(data) {
        let _this = this;
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/product/list.do'),
            data: data,
            doSuccess: function(json, msg) {
                _this.showData(json);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    showData: function(json) {
        let products = json.list;
        $('.table tr:gt(0)').remove();
        let status = new Map();
        status.set(1, '在售');
        status.set(2, '下架');
        status.set(3, '删除');
        for(let i = 0; i < products.length; i++) {
            $tr = $('<tr></tr>');
            $tr.append('<td>' + products[i].id + '</td>');
            $tr.append('<td>' + products[i].name + '</td>');
            $tr.append('<td>' + products[i].price + '</td>');
            $tr.append('<td>' + status.get(products[i].status) + '</td>');
            let idstr = 'id=' + products[i].id + "'";
            let a1 = "<a href='./product-detail.html?" + idstr + "><button class='btn btn-primary edit'>查看</button></a>";
            let a2 = "<a href='./product-edit.html?" + idstr + "><button class='btn btn-primary edit'>编辑</button></a>";
            $tr.append("<td>" + a1 + '  ' + a2 + '</td>');
            $('.table').append($tr);
        }
        $('.myPage .active > a').html(json.pageNum);
        util.showPage(json);
    },
    search: function() {
        let _this = this;
        let type = $('#type').val();
        let keyword = $.trim($('#keyword').val());
        if(util.isEmpty(keyword)) {
            alert('请输入关键词用来搜索');
            return;
        }
        let data;
        if(type === '1') {
            data = {
                productId: keyword
            }
        } else {
            data = {
                productName: keyword
            }
        }
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/product/search.do'),
            data: data,
            doSuccess: function(json, msg) {
                _this.showData(json);
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