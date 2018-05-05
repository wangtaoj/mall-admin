require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');
require('simditor/styles/simditor.css');
require('simditor/lib/module.js');
require('simditor/lib/hotkeys.js');
require('simditor/lib/uploader.js');
const Simditor = require('simditor/lib/simditor.js');

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
        //搜索
        $('#search').click(function() {
            _this.search();
        });
        //新增按钮
        $('#add').click(function() {
            $('#addDialog').modal({
                backdrop: false,
                show: true
            });
            //获取分类
            _this.getCategory(0, $('#categorys'));
            $('#imageArea').children().remove();
            //富文本
            var editor = new Simditor({
                textarea: $('#editor'),
                upload: {
                    url: '/manage/product/richtext_img_upload.do',
                    params: null,
                    fileKey: 'upload_file',
                    connectionCount: 10,
                    leaveConfirm: '文件还在上传中, 你确定要离开?'
                }
            });
        });
        //二级分类
        $('#categorys').change(function() {
            _this.getCategory($(this).val(), $('#childCategorys'));
        });
        //商品图片
        $('#image').change(function() {
            let formData = new FormData();
            formData.append('upload_file', $(this)[0].files[0]);
            _this.uploadImage(formData);
        });
        $('#save').click(function() {
            let $imgs = $('#imageArea').children();
            let imgUrls = '';
            $imgs.each(function(index, element) {
                if(index < $imgs.length - 1)
                    imgUrls = imgUrls + util.getUriFromUrl($(this).attr('src')) + ',';
                else
                    imgUrls = imgUrls + util.getUriFromUrl($(this).attr('src'));
            });
            let product = {
                name: $.trim($('#name').val()),
                subtitle: $.trim($('#subtitle').val()),
                categoryId: $('#childCategorys').val(),
                subImages: imgUrls,
                price: $.trim($('#price').val()),
                stock: $.trim($('#stock').val()),
                detail: $('#editor').val()
            }
            let res = _this.validData(product);
            if(res.success) {
                _this.save(product);
            } else {
                _this.showError(res.msg);
            }
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
        status.set(3, '弃用');
        for(let i = 0; i < products.length; i++) {
            let $tr = $('<tr></tr>');
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
    },
    //新增逻辑
    //获取分类
    getCategory: function(categoryId, sourceEle) {
        let _this = this;
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/category/get_category.do'),
            data: {'categoryId' : categoryId},
            doSuccess: function(json, msg) {
                _this.showCategory(sourceEle, json);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    showCategory: function(sourceEle, categorys) {
        //$('. tr:gt(0)').remove();
        if(sourceEle.attr('id') === 'categorys') {
            sourceEle.children('option:gt(0)').remove();
            $('#childCategorys').children().remove();
        }
        else
            sourceEle.children().remove();
        for(let i = 0; i < categorys.length; i++) {
            let option = "<option value='" + categorys[i].id + "'>" + categorys[i].name + "</option>";
            sourceEle.append(option);
        }
    },
    uploadImage: function(form) {
        let _this = this;
        $.ajax({
            url : '/manage/product/upload.do',
            data : form,
            type : 'post',
            dataType : 'json',
            contentType : false,
            processData : false,
            success: function(res) {
                _this.showImage(res.data);
            },
            error: function(err) {
                alert(err.statusText);
            }
        });
    },
    showImage: function(json) {
        let $img = "<img ondblclick=\"document.getElementById('imageArea').removeChild(this)\" width='150px' height='150px' src='" + json.url + "'></img>";
        $('#imageArea').append($img);
    },
    validData: function(product) {
        let res = {
            success: false,
            msg: ''
        }
        if(util.isEmpty(product.name)) {
            res.msg = '请输入商品名称';
            return res;
        }
        if(util.isEmpty(product.categoryId)) {
            res.msg = '请选择一个商品分类';
            return res;
        }
        if(util.isEmpty(product.price)) {
            res.msg = "请输入商品价格";
            return res;
        }
        if(isNaN(product.price)) {
            res.msg = "请输入一个合法的数字作为商品价格";
            return res;
        }
        if(util.isEmpty(product.stock)) {
            res.msg = "请输入商品库存";
            return res;
        }
        if(isNaN(product.price)) {
            res.msg = "请输入一个合法的数字作为商品库存";
            return res;
        }
        res.success = true;
        return res;
    },
    save: function(product) {
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/product/save.do'),
            data: product,
            doSuccess: function(json, msg) {
                $('#errorBox').hide();
                alert(msg);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    showError: function(errMsg) {
        $('#errorBox').hide(100).show(500).text(errMsg);
    }
}

$(function() {
    service.init();
});