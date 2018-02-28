const easydir = require('easydir');
const koarouter = require('koa-router')
const path = require('path'), fs = require('fs');

/**
 * @param {*} app APP对象 
 * @param {*} dir router目录 所有router所在的目录，会遍历所有文件
 * @param {*} opt perfix:所有路由Path前缀,dirperfix:文件夹Path前缀开关true or false ,custom:自定义文件Path前缀{文件名:前缀},index:设置根路径路由文件
 * 规则只适用于自定义路由
 */
const scanroute = (app, dir, opt) => {
  opt = Object.assign({ perfix: "", dirperfix: true }, opt || {})
  var { perfix, dirperfix, custom, index, child } = opt
  perfix = (perfix || "")[0] === '/' ? perfix.replace('/', "") : perfix;
  dirperfix = dirperfix ? true : false;
  custom = custom || {};
  index = index || 'index';
  dir = path.resolve(dir);
  let files = easydir.readir(dir);
  files.forEach(file => {
    if (file.type == easydir.TYPE.DIR_TYPE) {
      if (dirperfix) perfix += `/${file.name}`;
      scanroute(app, file.path, { perfix, dirperfix, custom, index, child: true })
    } else {
      let _route_file = require(file.path);
      if (typeof _route_file === 'function') {
        let filename = path.basename(file.name, '.js')
        let _prefix = null;
        if ((filename != index) || child) {
          if (perfix) {
            _prefix = `/${perfix}`;
          }
          if ((filename != index)) {
            if (custom[filename] || custom[`${filename}.js`]) {
              _prefix = (_prefix || "") + `/${custom[filename] || custom[`${filename}.js`]}`
            } else
              _prefix = (_prefix || "") + `/${filename}`
          }
        }
        let _route = new koarouter({ prefix: _prefix });
        _route_file = _route_file(_route)
      }
      app.use(_route_file.routes(), _route_file.allowedMethods())
    }
  })
}

module.exports = scanroute