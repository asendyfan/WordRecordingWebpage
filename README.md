## 心得 ##
### 逻辑上 ###
1. react加express，前后端分离方法，在*package.json*文件中，添加`"proxy": "http://localhost:3030/",`

1. 关于react组件中**父组件与子组件**还有**子组件之间**的传递方式可以阅读淘宝前端的做法：[网页地址](http://taobaofed.org/blog/2016/11/17/react-components-communication/)
1. `<a href="javascript:;`

### 标签上 ###
1. select标签中改变option时，可以通过添加onchange事件监听，option值为e.target.value
1. 阻止标签的默认事件发生,比如表单的自动提交 `event.preventDefault()`
1. 表单中添加，required，会自动检查其有效性

### 样式上 ###
1. 通过bootstrap，水平居中有以下方法实现
    - 通过flex布局添加类名：d-flex justify-content-center
    - 通过父元素为block布局添加，但是要确定子元素的具体宽度，添加类名mx-auto 
