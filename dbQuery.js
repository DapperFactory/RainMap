var fs = require('fs');
var db_file = 'RAINAPP.db';      		//pass in databse files
var exist = fs.existsSync(db_file); 	//check if files exists
var sqlite3 = require('sqlite3').verbose(); 	//connect to database
var db = new sqlite3.Database('RAINAPP.db');	
console.log('Connecting to Database');

var well_cordinates = []; 



//function getData( Query , callback){
function getWellLocations(well_cordinates){
	
		db.each("SELECT * FROM Well_Locations WHERE ID LIKE 'V%' ", function(err, row) {
			//console.log(row);
			if(err) console.log(err);
			well_cordintes.push(parseLatLong(row));
		});

		return well_cordintes;

}

function parseLatLong(row){
		//console.log(myData);
		var latitude = Number(row.LAT_DEGREE) + Number(row.LAT_MINUTE)/60 + Number(row.LAT_SECOND)/3600;
		//console.log("Latitude: " + latitude);
		var longitude = Number(row.LNG_DEGREE) + Number(row.LNG_MINUTE)/60 + Number(row.LNG_SECOND)/3600;
		//console.log("longitude: " + longitude);
		var latLng = {'WellId':row.ID, 'Latitude': latitude, 'Longitude': longitude }
		console.log(latLng);

		return {latLng};
}





