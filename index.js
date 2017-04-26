var easydir = require('easydir');
var path = require('path'), fs = require('fs');
const default_opts = { index: 'index.js', child: false, prefix: '' }

function route(app, dir, opts) {
  let _dirs = [];
  opts = Object.assign(default_opts, opts);
  if (opts.child) {
    opts.prefix = `${opts.prefix}/${path.basename(dir)}`
    var router = require('koa-router')({ prefix: opts.prefix });
  }
  else
    var router = require('koa-router')();
  let index_route_name = opts.index.replace('.js', '') + '.js';
  let routes_dir = path.resolve(dir);
  let file_tree = easydir.readir(routes_dir, { deep: false });
  file_tree.forEach(file => {
    if (file.type === easydir.TYPE.FILE_TYPE) {
      let route_file = require(file.path);
      if (file.name === index_route_name && !opts.child)
        app.use(route_file.routes(), route_file.allowedMethods());
      else if (file.name != index_route_name)
        router.use(`/${file.name === index_route_name ? '' : file.name.replace('.js', '')}`, route_file.routes(), route_file.allowedMethods())
    }
    if (file.type === easydir.TYPE.DIR_TYPE) {
      _dirs.push(file)
      if (fs.existsSync(file.path + path.sep + index_route_name)) {
        let route_file = require(file.path + path.sep + index_route_name);
        router.use(`/${file.name === index_route_name ? '' : file.name.replace('.js', '')}`, route_file.routes(), route_file.allowedMethods())
      }
    }
  })
  app.use(router.routes(), router.allowedMethods());
  _dirs.forEach(d => {
    route(app, d.path, { child: true, prefix: opts.prefix })
  })
}

module.exports = route;
