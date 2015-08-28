var express    = require('express');
var fs 		   = require('fs');
var jsonfile   = require('jsonfile');
var geoJson    = require('geojson');
var bodyParser = require('body-parser');
var lazy       = require('lazy');

//Initialize Database connections
var db_file = "RAINAPP.db";      		//pass in databse files
var exist = fs.existsSync(db_file); 	//check if files exists
console.log(exist);
var sqlite3 = require('sqlite3').verbose(); 	//connect to database
var db = new sqlite3.Database('RAINAPP.db');	

console.log('Connecting to Database');

var app = express();
app.use(bodyParser.json()); //support json encoded bodies
app.use(bodyParser.urlencoded({extended: true }));//support encoded body
var wells = [];
loadWells(wells);

app.set('views', __dirname + '/views');
app.use(express.static( __dirname + '/resources'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.get('/testMap', function(req, res){
	
	res.render('google-maps.html', {well_data: wells});
});

//JSON well dump
app.get('/', function(req, res){
	
	res.json(wells);
});

app.get('/heatmap', function(req, res){
	
	res.render('heatMaps.html', {wellLocations: wellInfo});
});

app.get('/scalable', function(req, res){
	
	res.render('scalableMap.html', {well_data: wells});
});

//SMS DUMP APPEND TO FILE
app.post('/api/smsdump', function(req, res){
	//retrive POST DATA
	//http://www.domain-name.com/keyword.php?mobile=9945xxxxxx&msg=UD9945xxxxxx
	var number = req.body.mobile;
	var msg = req.body.msg;
	console.log(number + ":" + msg);
	res.send("Number=" + number + " Message=" + msg);
	fs.appendFile('smsDump.log', number + '::' + msg + '\r\n');
	//Write and append data to a file
	//this is just for safe keeping

});


//pass empty list to get filled by the query 
function loadWells(wells){
		//TODO: Change query to inner join that  includes well level 
		var sqlQuery = "SELECT * FROM Well_Locations NATURAL JOIN Well_Levels"
		db.each(sqlQuery, function(err, row) {
			//console.log(row);
			if(err) console.log(err);
			//console.log(myData);
			var latitude = Number(row.LAT_DEGREE) + Number(row.LAT_MINUTE)/60 + Number(row.LAT_SECOND)/3600;
			//console.log("Latitude: " + latitude);
			var longitude = Number(row.LNG_DEGREE) + Number(row.LNG_MINUTE)/60 + Number(row.LNG_SECOND)/3600;
			//console.log("longitude: " + longitude);
			var well = {Id:row.ID, lat: latitude, lng: longitude, Elevation: row.ELEVATION_m, Level: row.TOT_WELL_DEPTH_m, TimeStamp: row.T_STAMP };
			//add a well to the list
			wells.push(well);
			console.log('Added: '+ well.Id);

		}, function(err, rows){
			//quety completed with more than 1 row so we will convert the new data to geoJson and update the old geoJson
			if(rows > 0){
				console.log("Completed Query");
				wells = geoJson.parse(wells, {Point: ['lat', 'lng']});
				saveWells('views/wellsGeoJson.json', wells);			}
		}

		);

		
		

}

function saveWells(file, obj){
	jsonfile.writeFile(file, obj, function(err) {
		if(err) console.error(err);
	});
}

// function parseLatLong(row){
// 		//console.log(myData);
// 		var latitude = Number(row.LAT_DEGREE) + Number(row.LAT_MINUTE)/60 + Number(row.LAT_SECOND)/3600;
// 		//console.log("Latitude: " + latitude);
// 		var longitude = Number(row.LNG_DEGREE) + Number(row.LNG_MINUTE)/60 + Number(row.LNG_SECOND)/3600;
// 		//console.log("longitude: " + longitude);
// 		var latLng = {'WellId':row.ID, 'Latitude': latitude, 'Longitude': longitude }
// 		console.log(latLng);

// 		return {latLng};
// }


app.listen(8888);	
console.log('Started server on port 8888');