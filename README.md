# easy-koa-router
Traverse the specified routing folder and follow the file name and folder name as the routing path


## usage

### npm i -save easy-koa-router


## describing

function route(/*Koa_app*/, /*router dir*/, /*options*/)

options:{
  index:'make index file for path of /,default is index.js'
  }

## example
```javascript
require('./easy-koa-router')(app, './routes')
```

## 描述

传入koa的app对象和须要遍历的路由文件夹，将针对路由文件夹内的koa-router的js文件遍历为path为文件名或文件夹名字的路由