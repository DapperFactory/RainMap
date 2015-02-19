var express = require('express');
//var html = require('html');
var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.get('/simplemap', function(req, res){
	
	res.render('maps.html');
});
app.get('/heatmap', function(req, res){
	
	res.render('heatMaps.html');
});

app.get('/scalable', function(req, res){
	
	res.render('scalableMap.html');
});


app.listen(8888);	
console.log('Started server on port 8888');