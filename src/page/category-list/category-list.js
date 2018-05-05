require('./style.css');
require('page/common/nav/nav.js');
require('page/common/footer/style.css');

const util = require('utils/util.js');

const service = {
    init: function() {
        this.query(0, 1);
        this.bindEvent();
    },
    bindEvent: function() {
        let _this = this;
        //通过on函数绑定动态生成的编辑按钮事件
        $('.table').on('click', '.editBtn', function() {
            $('#editDialog').modal({
                backdrop: false,
                show: true
            });
            $('#id').val($(this).attr('name'));
            $('#editErrorBox').hide();
        });

        //通过on函数绑定动态生成的查看子分类按钮事件
        $('.table').on('click', '.showChildren', function() {
            let categoryId = $(this).attr('name');
            _this.query(categoryId, 1);
        });

        //通过on函数绑定动态生成的弃用分类按钮事件
        $('.table').on('click', '.remove', function() {
            let categoryId = $(this).attr('name');
            let data = {'categoryId': categoryId};
            _this.remove(data);
        });

        //新增分类模态框
        $('#add').click(function() {
            $('#addDialog').modal({
                backdrop: false,
                show: true
            });
            $('#errorBox').hide();
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
                _this.showError(res.msg);
            }
        });

        //更新请求
        $('#edit').click(function(){
            let data = {
                categoryId: $.trim($('#id').val()),
                categoryName: $.trim($('#editCategoryName').val())
            }
            if(util.isEmpty(data.categoryName)) {
                $('#editErrorBox').hide().show(500).text('请输入分类名称');
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
            map.set(false, '弃用');
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
    //新增或修改下拉框数据
    showCategory: function(categorys) {
        $('#categorys option:gt(0)').remove();
        for(let i = 0; i < categorys.length; i++) {
            let option = "<option value='" + categorys[i].id + "'>" + "顶层分类/" + categorys[i].name + "</option>";
            $('#categorys').append(option);
        }
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
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/category/add_category.do'),
            data: data,
            doSuccess: function(json, msg) {
                $('#errorBox').hide();
                alert(msg);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    //更新分类名字
    update: function(data, $td) {
        util.request({
            type: 'post',
            url: util.getServletUrl('/manage/category/set_category_name.do'),
            data: data,
            doSuccess: function(json, msg) {
                $('#errorBox').hide();
                alert(msg);
                window.location.reload();
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
                _this.query(0, 1);
            },
            doError: function(errMsg) {
                alert(errMsg);
            }
        });
    },
    //显示错误
    showError: function(errMsg) {
        $('#errorBox').hide(100).show(500).text(errMsg);
    }
}

$(function() {
    service.init();
});