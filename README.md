# easy-koa-router
Traverse the specified routing folder and follow the file name and folder name as the routing path


## usage

### npm i -save easy-koa-router


## describing

require('easy-koa-router')(app, './routes',opt)
opt可传入perfix:所有路由Path前缀,dirperfix:文件夹Path前缀开关true or false ,custom:自定义文件Path前缀{文件名:前缀},index:设置根路径路由文件

需要使用自动适配perfix请以以下模板为路由文件模板(兼容原路由创建方式)

module.exports = (router) => {

  /**
  *此处写路由
  */

  return router
}


## example
```javascript
require('easy-koa-router')(app, './routes',opt)
```

## 描述

传入koa的app对象和须要遍历的路由文件夹，将针对路由文件夹内的koa-router的js文件遍历为path为文件名或文件夹名字的路由