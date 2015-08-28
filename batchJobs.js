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

function parseSMSDump(){
    
	new lazy(fs.createReadStream('./smsDump.log'))
    	.lines
     	.forEach(function(line){
     		//line --> SMA::PostalCode Date WellID Depth
     		console.log(line.toString());
     		var str = line.split("::")[1].split(" ").filter(Boolean);
     		//str --> [PostalCode, Date, WellID, Depth]
     		console.log(str.toString());
     		if(str.length == 4) {
     			console.log("str is length 4");
     		}
        	//console.log(line.toString());
     }
 );
}