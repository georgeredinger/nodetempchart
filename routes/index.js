
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
exports.flot = function(req, res){
  res.render('flot', { title: 'Gail\'s House', what: 'Temperature', jquery:true, socket:true })
};
