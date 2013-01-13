
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
exports.flot = function(req, res){
  res.render('flot', { title: 'Socket.io + flot + jeenode DS18B20', what: 'Temperature', jquery:true, socket:true })
};
