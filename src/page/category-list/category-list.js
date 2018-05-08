require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');

const util = require('utils/util.js');

/**
 * 模态框方法封装
 */
const modalDialog = {
    //初始化模态框
    init: function(selector) {
        $(selector).modal({
            backdrop: false,
            show: false
        });
    },
    // 打开模态框
    show: function(selector) {
        $(selector).modal('show');
    },
    //隐藏模态框
    hide: function(selector) {
        $(selector).modal('hide');
    }
}

/**
 * 业务封装
 */
const service = {
    init: function() {
        this.query(this.info.categoryId, 1);
        this.bindEvent();
        modalDialog.init('#editDialog');
        modalDialog.init('#addDialog');
    },
    info: {
        //点击更新按钮时用来记录是哪一行触发的按钮事件
        $curTr: null,
        //记住当前页面的父分类ID, 默认顶层分类为0
        categoryId: 0,
    },
    bindEvent: function() {
        let _this = this;
        //通过on函数绑定动态生成的编辑按钮事件
        $('.table').on('click', '.editBtn', function() {
            modalDialog.show('#editDialog');
            //绑定要修改的分类id, 用于提交更新
            $('#id').val($(this).attr('name'));
            //绑定当前触发事件的行元素
            let temp = $(this).parents('tr');
            _this.info.$curTr = temp;
            $('#editCategoryName').val(temp.children().eq(1).text());
        });

        //通过on函数绑定动态生成的查看子分类按钮事件
        $('.table').on('click', '.showChildren', function() {
            let categoryId = parseInt($(this).attr('name'));
            _this.info.categoryId = categoryId || 0;
            _this.query(categoryId, 1);
        });

        //通过on函数绑定动态生成的弃用分类按钮事件
        $('.table').on('click', '.remove', function() {
            if(confirm('会删除所有子分类, 你确定要删除吗?')) {
                let categoryId = $(this).attr('name');
                let data = {'categoryId': categoryId};
                _this.remove(data);
            }
        });

        //新增分类模态框
        $('#add').click(function() {
            modalDialog.show('#addDialog');
            _this.query(0, 2);
        });

        //新增请求
        $('#save').click(function() {
            let data = {
                parentId: $.trim($('#categorys').val()),
                categoryName: $.trim($('#categoryName').val())
            }
            let res = _this.validData(data);
            if(res.success) {
                _this.add(data);
            } else {
                alert(res.msg);
            }
        });

        //更新请求
        $('#edit').click(function(){
            let data = {
                categoryId: $.trim($('#id').val()),
                categoryName: $.trim($('#editCategoryName').val())
            }
            if(util.isEmpty(data.categoryName)) {
                alert('请输入分类名称');
            } else {
                _this.update(data);
            }
        }); 
    },
    //根据分类Id查询子分类
    /**查询categoryId分类下的子分类
     * flag: 1 or 2  展示数据在表格(1)还是下拉框(2)
     * categoryId = 0表示是顶级分类, 是所有分类的祖先
     */
    query: function(categoryId, flag) {
        let _this = this;
        util.request({
            type: 'get',
            url: util.getServletUrl('/manage/category/get_category.do'),
            data: {'categoryId': categoryId},
            doSuccess: function(json, msg) {
                if(flag === 1) {
                    _this.showData(json, categoryId);
                }
                else if(flag === 2) {
                    _this.showCategory(json);
                }
            },
            doError: function(errMsg) {
                alert(errMsg)
            }
        });
    },
    //表格数据
    /**
     * flag === 0, 展示一级分类数据, 需要子分类按钮
     * flag !== 0, 二级分类, 不需要查看子分类按钮
     */
    showData: function(categorys, flag) {
        $('.table tr:gt(0)').remove();
        for(let i = 0; i < categorys.length; i++) {
            let $tr = $('<tr></tr>');
            $tr.append('<td>' + categorys[i].id + '</td>');
            $tr.append('<td>' + categorys[i].name + '</td>');
            let map = new Map();
            map.set(true, '正常');
            let removeLink = "&nbsp;&nbsp;<a name='" + categorys[i].id + "' class='link remove'>删除</a>"
            $tr.append('<td>' + map.get(categorys[i].status) + removeLink + '</td>');
            let a1 = '';
            if(flag === 0)
               a1 = "<a name='" + categorys[i].id + "' class='link showChildren'>查看子分类</a>&nbsp;&nbsp;&nbsp;";
            let a2 = "<a name='" + categorys[i].id + "' class='link editBtn'>编辑</a>";
            $tr.append('<td>' + a1 + a2 + '</td>');
            $('.table').append($tr);
        }
    },
    //新增时下拉框数据
    showCategory: function(categorys) {
        let template = '<option value="0">顶层分类</option>';
        for(let i = 0; i < categorys.length; i++) {
            if(this.info.categoryId === categorys[i].id) {
                template += "<option selected='selected' value='" + categorys[i].id + "'>" 
                         + "顶层分类/" + categorys[i].name + "</option>";
            }
            else {
                template += "<option value='" + categorys[i].id + "'>" + "顶层分类/" 
                         + categorys[i].name + "</option>";
            }
        }
        $('#categorys').html(template);
    },
    //检查数据
    validData: function(data) {
        let res = {
            success: false,
            msg: ''
        }
        if(util.isEmpty(data.parentId)) {
            res.msg = "请选择父分类";
            return res;
        }
        if(util.isEmpty(data.categoryName)) {
            res.msg = "请输入分类名";
            return res;
        }
        res.success = true;
        return res;
    },
    //添加
    add: function(data) {
        let _this = this;
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/category/add_category.do'),
            data: data,
            doSuccess: function(json, msg) {
                alert(msg);
                modalDialog.hide("#addDialog");
                _this.query(_this.info.categoryId, 1);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    //更新分类名字
    update: function(data) {
        let _this = this;
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/category/set_category_name.do'),
            data: data,
            doSuccess: function(json, msg) {
                alert(msg);
                _this.info.$curTr.children().eq(1).text(data.categoryName);
                modalDialog.hide('#editDialog');
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    //弃用分类
    remove: function(data) {
        let _this = this;
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/category/remove.do'),
            data: data,
            doSuccess: function(json, msg) {
                alert(msg);
                _this.query(_this.info.categoryId, 1);
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