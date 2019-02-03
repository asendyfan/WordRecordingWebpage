网站预览：[www.pengyangfan.top](http://www.pengyangfan.top/WordRecords)

## 心得 ##

### react上 ###
1. react加express，前后端分离方法，在*package.json*文件中，添加`"proxy": "http://localhost:3030/",`
1. 关于react组件中**父组件与子组件**还有**子组件之间**的传递方式可以阅读淘宝前端的做法：[网页地址](http://taobaofed.org/blog/2016/11/17/react-components-communication/)
1. 尽量保持状态的不变性，这样更利于维护和简化逻辑

### javascript上 ###
- 如何使用promise+async/await是异步请求变成同步的，并且返回promise里面的值：
    + `let a = await new Promise(....).catch(err=>{...})`
    - a的值就是promise调用resolve返回的值，[文档解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
    - promise调用reject的话，会先执行catch err逻辑，再往下，此时a为undefined
- Date库，[参考文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
    1. 获得当前时间毫秒数：`Date.now()`
    1. 获得指定时间的毫秒数：`new Date(date).getTime()` 
    1. 获得本地的日期：`dateObj.toLocaleDateString() //2019-1-27`
    1. 日期格式设置：`new Date().toLocaleDateString('nu-arab',{'timeZone':'Asia/Shanghai','year':'numeric','month':'2-digit','day':'2-digit'}) //2019/01/29`
    1. 获得本地的时间：`dateObj.toLocaleTimeString('en-US', { hour12: false }) //22:03:05`
- 技巧上
    1. 遍历同时删掉原数组的某些值的方法：
        ```
        for(let i=0;i<arrayLength;i++){
            if(condition){
                array.splice(i,1)
                i--
            }
        }
        ```
- window
    1. 刷新当前页面 bForceGet 默认值为false，意思为从缓冲读取当前页面，true时从服务器读取最新页面 `window.location.reload([bForceGet])`
    1. 返回浏览过的指定页面 （返回上一页）`window.history.go(-1)`
- dom
    1. 阻止事件的冒泡或捕获：`event.stopPropagation(); `
    1. 阻止该事件以外的其它所有事件（比如捕获、冒泡，以及监听该dom的其他事件：`event.stopImmediatePropagation();`


### 标签上 ###
1. select标签中改变option时，可以通过添加onchange事件监听，option值为e.target.value
1. 阻止标签的默认事件发生,比如表单的自动提交 `event.preventDefault()`
1. 表单中添加，required，会自动检查其有效性
1. `<hr/>`标签，为一条横线，display为block
1. 阻止链接或表单跳转添加此属性`href="javascript:;"`

### 样式上 ###
1. 通过bootstrap，水平居中有以下方法实现
    - 通过flex布局添加类名：d-flex justify-content-center
    - 通过父元素为block布局添加，但是要确定子元素的具体宽度，添加类名mx-auto 
1. 某标签不占用当行的位置，将该标签添加类名：float-xx-left或者float-xx-right, 其兄弟元素要表现为block，添加类名d-block
1. input以及button通过样式名`d-inline-block`放在一行时，给input添加`.form-control`可以保持行高的一致
1. 多个控件在一行，只指定某一个控件在中间的实现方式：
    + 父容器设定为相对定位，居中的控件包一个绝对定位，并设置`top:0px;z-index:100`，其他组件放后面

