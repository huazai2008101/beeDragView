/**
 * 全媒资拖拽控件
 */
(function($){
    String.prototype.isInt=function (obj) {
        if (this == "NaN")
            return false;
        return this == parseInt(this).toString();
    };
    $.fn.beeDragView=function(options){
        var defaults={
            cellHeight: 80,
            verticalMargin: 15,
            width:6,
            height:4,
            float:true,
            animate:true,
            handle:'.item-header',
            dblclickEditUrl:"editPanelData.html",
            dblclickAddUrl:"addPanelData.html",
            resizeCallback:function (el,width,height) {
                el.find(".item-header .size-info").html("("+width+"*"+height+")");
            },
            removeViewCallback:function (grid,view,node) {
                if (!confirm("要删除UI板块？")){
                    return;
                }
                grid.removeWidget(view);
            },
            dragOrResizeCallback:function () {

            },
            ajaxCallback:function (el,data) {
                $("#myModal .modal-content").html(data);
                $("#myModal").modal("show");
                var node=context.getItemLayout(el);
                $("#width").val(node.width);
                $("#height").val(node.height);
                $("#x").val(node.x);
                $("#y").val(node.y);
                if (node.id!=null){
                    $("#id").val(node.id);
                }
                $("#image").val(node.image);
                $("#locked").val(node.locked);
            }
        };
        var template=function (node) {
            var content='<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="item-box" ><div class="item-header">点我拖拽 <span class="size-info"></span></div><div class="item-content"></div>';
            if(node.locked!=1){
                content+='<div class="item-footer"><span class="menu-item menu-item-delete glyphicon glyphicon-trash"></span></div>';
            }
            content+=' </div></div></div>';
            return content;
        };
        options= $.extend(defaults,options);

        var data=null;
        if(options.data!=undefined){
            data=options.data;
            delete options.data;
        }
        $(this).gridstack(options);
        grid=$(this).data("gridstack");

        if(data!=null){
            $.each(data,function (i,node) {
                var myNode={};
                if(node.id!=undefined){
                    myNode.id=node.id;
                }
                if(node.imgUrl!=undefined){
                    myNode.image=node.imgUrl;
                }else {
                    myNode.image="";
                }
                if(node.locked!=undefined){
                    myNode.locked=node.locked;
                }else {
                    myNode.locked=0;
                }
                myNode.x=node.column;
                myNode.y=node.row;
                myNode.width=node.columnSize;
                myNode.height=node.rowSize;
                grid.addWidget(template(node),myNode);
            });
        }

        var context={
            grid:grid,
            addWidget:function (node) {
                grid.addWidget(template(node),node);
            },
            checkFillAll:function () {
                var isFillAll=true;
                for (var i=0;i<grid.opts.width;i++){
                    for (var n=0;n<grid.opts.height;n++){
                        if(grid.isAreaEmpty(i,n,1,1)){
                            isFillAll=false;
                            break;
                        }
                    }
                    if(!isFillAll){
                        break;
                    }
                }
                return isFillAll;
            },
            getLayout:function () {
                var $this=this;
                var res = _.map($(".grid-stack-item:not(.grid-stack-placeholder)",grid.container), function (el) {
                    el = $(el);
                    return $this.getItemLayout(el);
                });
                return res;
            },
            getItemLayout:function (el) {
                var node = el.data('_gridstack_node');
                var nodeVal={
                    id: node.id,
                    row: node.y,
                    column: node.x,
                    rowSize: node.height,
                    columnSize: node.width
                };
                if(node.locked==true){
                    nodeVal.locked=1;
                }else {
                    nodeVal.locked=0;
                }
                if(node.id==undefined){
                    nodeVal.id=null;
                }
                var image=el.data("gs-image");
                if(image==undefined){
                    nodeVal.imgUrl="";
                }else {
                    nodeVal.imgUrl=image;
                }
                return nodeVal;
            }
        };

        $(this).on("click",".grid-stack-item .item-footer .menu-item",function () {
            var view=$(this).parents(".grid-stack-item");
            var node=context.getItemLayout(view);
            options.removeViewCallback(grid,view,node);
        });
        $(this).on("dblclick",".grid-stack-item .item-content",function () {
            var parent=$(this);
            var gridStackItem=$(this).parents(".grid-stack-item");
            context.dblclickItemView=gridStackItem;
            var id=gridStackItem.data("gs-id");
            var url=null;
            var params={};
            if (id==undefined){
                url=options.dblclickAddUrl;
            }else {
                url=options.dblclickEditUrl;
                params.id=id;
            }
            $.get(url,params,function (data,status) {
                if(status!="success"){
                    return;
                }
                if(grid.opts.ajaxCallback!=undefined&&typeof grid.opts.ajaxCallback=="function"){
                    grid.opts.ajaxCallback(parent.parents(".grid-stack-item"),data);
                }
            });
        });
        return context;
    };
})(jQuery);