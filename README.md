# beeDragView Android自定义UI布局控件
beeDragView是一款专门为智能电视、盒子lanucher动态定制UI布局控件，可以在线上配置坑位图片及坑位action跳转等，也可以配置专题等数据，最后生成UI布局数据由Android终端渲染出来。另外beeDragView是基于grid-stack控件修改过来的

1.创建UI坑位，点击新增
需要填写坑位宽度、高度、X偏移量、Y偏移量等参数，点击确定即可
2.配置数据及定义行为，可以双击坑位上任意位置，就会弹出一个可编辑页面，然后编辑其中数据，然后点击确定即可保存数据
3.如有页面上的坑位配置需要调整，可以对着某个坑位按住鼠标左键，然后拖动，这时候发现坑位会随着鼠标拖动而移动，移动到合适的位置然后释放鼠标即可
4.当页面拖拽布局完成后，点击保存按钮就会把当前布局页面保存到远程服务器中，并发布给OTT终端，终端拿到该布局数据后会根据当前数据来重新渲染桌面UI

注意：demo中需要ajax请求，所以下载代码后请放在Apache/Nginx服务器下运行

配置参数：

cellHeight：板块高度，默认为80px
verticalMargin：垂直外边距,默认为15px
width：布局画布总宽度大小，默认6个单位
height：布局画布总高度大小，默认4个单位
dblclickEditUrl：双击编辑坑位地址
dblclickAddUrl：双击添加坑位地址

#----------------------------------------

事件：

resizeCallback:function (el,width,height){}
坑位大小被调整时会触发该事件，参数：el当前对象，width调整后单位宽度，height调整后单位高度

removeViewCallback:function (grid,view,node){}
坑位被删除后会执行这个回调方法，参数：grid是grid-stack对象，view是当前要删除的对象，node节点数据

ajaxCallback:function(el,data){}
坑位双击触发向服务器发送请求数据，请求完成触发该事件
