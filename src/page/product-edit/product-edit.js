require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');
require('simditor/styles/simditor.css');
require('simditor/lib/module.js');
require('simditor/lib/hotkeys.js');
require('simditor/lib/uploader.js');
const Simditor = require('simditor/lib/simditor.js');
const util = require('utils/util.js');

//富文本
const editor = new Simditor({
    textarea: $('#editor'),
    upload: {
        url: '/manage/product/richtext_img_upload.do',
        params: null,
        fileKey: 'upload_file',
        connectionCount: 10,
        leaveConfirm: '文件还在上传中, 你确定要离开?'
    }
});

const service = {
    init: function() {
        
        this.query();
        this.bindEvent();
    },
    query: function() {
        let _this = this;
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/product/detail.do'),
            data: {productId: util.getParam(window.location.href, 'id')},
            doSuccess: function(json, msg) {
                //一级分类
                _this.getCategory(0, $('#categorys'), json.parentCategoryId);
                _this.getCategory(json.parentCategoryId, $('#childCategorys'), json.categoryId);
                _this.showData(json);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    bindEvent: function() {
        let _this = this;
        //二级分类
        $('#categorys').change(function() {
            _this.getCategory($(this).val(), $('#childCategorys'), null);
        });
        //商品图片
        $('#image').change(function() {
            let formData = new FormData();
            formData.append('upload_file', $(this)[0].files[0]);
            _this.uploadImage(formData);
        });
        $('#update').click(function() {
            let $imgs = $('#imageArea').children();
            let imgUrls = '';
            $imgs.each(function(index, element) {
                if(index < $imgs.length - 1)
                    imgUrls = imgUrls + util.getUriFromUrl($(this).attr('src')) + ',';
                else
                    imgUrls = imgUrls + util.getUriFromUrl($(this).attr('src'));
            });
            let product = {
                id: $.trim($('#id').val()),
                name: $.trim($('#name').val()),
                subtitle: $.trim($('#subtitle').val()),
                categoryId: $('#childCategorys').val(),
                subImages: imgUrls,
                price: $.trim($('#price').val()),
                stock: $.trim($('#stock').val()),
                detail: editor.getValue()
            }
            let res = _this.validData(product);
            if(res.success) {
                _this.save(product);
            } else {
                _this.showError(res.msg);
            }
        });
    },
    showData: function(json) {
        $('#id').val(json.id);
        $('#name').val(json.name);
        $('#subtitle').val(json.subtitle);
        let imgUrls = json.subImages.split(',');
        for(let i = 0; i < imgUrls.length; i++) {
            this.showImage(json.imageHost + imgUrls[i]);
        }
        let status = new Map();
        status.set(1, '在售');
        status.set(2, '下架');
        status.set(3, '弃用');
        for(let i = 1; i <= 3; i++) {
            let option;
            if(i === json.status) {
                option = "<option selected = 'selected' value='" + i + "'>" + status.get(i) + "</option>";
            } else {
                option = "<option value='" + i + "'>" + status.get(i) + "</option>";
            }
            $('#status').append(option);
        }
        
        $('#price').val(json.price);
        $('#stock').val(json.stock);
        editor.setValue(json.detail);
    },
    //获取分类
    getCategory: function(categoryId, sourceEle, defaultCategoryId) {
        let _this = this;
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/category/get_category.do'),
            data: {'categoryId' : categoryId},
            doSuccess: function(json, msg) {
                _this.showCategory(sourceEle, json, defaultCategoryId);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    showCategory: function(sourceEle, categorys, defaultCategoryId) {
        //$('. tr:gt(0)').remove();
        if(sourceEle.attr('id') === 'categorys') {
            sourceEle.children('option:gt(0)').remove();
            $('#childCategorys').children().remove();
        }
        else
            sourceEle.children().remove();
        for(let i = 0; i < categorys.length; i++) {
            let option;
            if(categorys[i].id === defaultCategoryId)
                option = "<option selected = 'selected' value='" + categorys[i].id + "'>" + categorys[i].name + "</option>";
            else
                option = "<option value='" + categorys[i].id + "'>" + categorys[i].name + "</option>";
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
                _this.showImage(res.data.url);
            },
            error: function(err) {
                alert(err.statusText);
            }
        });
    },
    showImage: function(url) {
        let $img = "<img ondblclick=\"document.getElementById('imageArea').removeChild(this)\" width='150px' height='150px' src='" + url + "'></img>  ";
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