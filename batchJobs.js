var express    = require('express');
var fs         = require('fs');
var lazy       = require('lazy');
var CronJob = require('cron').CronJob;

//Initialize Database connections
var db_file = "RAINAPP.db";             //pass in databse files
var exist = fs.existsSync(db_file);     //check if files exists
console.log(exist);
var sqlite3 = require('sqlite3').verbose();     //connect to database
var db = new sqlite3.Database('RAINAPP.db');    
var rawList =[];
var uniqueList = [];

console.log('Connecting to Database');
// //'00 30 11 * * 1-5'
// var parseJob = new CronJob('* * * * * *', function() {
//     // Runs every weekday (Monday through Friday)
//     // at 11:30:00 AM. It does not run on Saturday
//     // or Sunday.
    
//     console.log("Starting Job");
    
//      new lazy(fs.createReadStream('./smsDump.log'))
//         .lines
//         .forEach(function(line){
//             //line --> SMA::PostalCode Date WellID Depth
//             //console.log(line.toString());
//             line = line.toString();

//             var num_message = line.split('::');
//             var message = num_message[1].split(' ').filter(Boolean);
//             //message --> [PostalCode, Date, WellID, Depth]
//             //console.log(message.toString());
//             if(message.length == 4) {
//                 //Convert ddmmyy to YYYY-MM-DD
//                 var date = message[1].replace(/(\d{2})(\d{2})(\d{2})/g, '20$3-$2-$1'); 
//                 var wellID = Number(message[2]);
//                 var depth = Number(message[3]);
//                 var item = [wellID, depth, date];
//                 rawList.push(item);
//                 console.log(item);
//             }
//         })//for each
//         .join(function(){
//             console.log("Finished parsing");
//             var uniqueList = rawList.filter(arrayLastUnique);
//             printInsertDB(uniqueList);
//         });   
//     },
//         //exicutes after parseJob has finished
//         null,
//         true, //unitTestCall
//         "America/Los_Angeles"
// );



//unitTestCall 
function unitTest(){
    // Runs every weekday (Monday through Friday)
    // at 11:30:00 AM. It does not run on Saturday
    // or Sunday.
        console.log("Running Unit Test");
        
        new lazy(fs.createReadStream('./smsDump.log'))
        .lines
        .forEach(function(line){
            //line --> SMA::PostalCode Date WellID Depth
            //console.log(line.toString());
            line = line.toString();

            var num_message = line.split('::');
            var message = num_message[1].split(' ').filter(Boolean);
            //message --> [PostalCode, Date, WellID, Depth]
            //console.log(message.toString());
            if(message.length == 4) {
                //Convert ddmmyy to YYYY-MM-DD
                var date = message[1].replace(/(\d{2})(\d{2})(\d{2})/g, '20$3-$2-$1'); 
                var wellID = Number(message[2]);
                var depth = Number(message[3]);
                var item = [wellID, depth, date];
                rawList.push(item);
                console.log(item);
            }
            //console.log(line.toString());
        })
        .join(function(){
            console.log("Finished parsing");
            //var uniqueList = rawList.filter(arrayLastUnique);
            //console.log(rawList[0].toString());
            createUniqueList(rawList);
            
        });

        
    };
unitTest();


function createUniqueList(rawList){
    for(var i = rawList.length-1; i> -1; i--){
        
        console.log(rawList[i].toString());
        
        var insert = rawList[i][0];
        for(var j = 0; j < uniqueList.length; j++){
            if(insert == uniqueList[0])
        }
        if(!(insert in uniqueList)){
            uniqueList.push(rawList[i]);
        }
    }
    printInsertDB(uniqueList);
}

function arrayLastUnique() {
    for(var i = this.length; i > -1; i--){
        var c = this[i].wellID;
        return this.filter(function (a, b, c) {
            // keeps last occurrence
            return c.indexOf(a, b + 1) < 0;
        });
    }
}
function printInsertDB(list){
    console.log("Printing Unique List");
    if(list.length == 0){
        console.log("List is empty");
    }
    list.forEach(function(entry){
        console.log(entry[0] + ", " + entry[1] + ", " + entry[2]);
    });
}

function insertDB(list){
    //Loading values into db
                var stmt = db.prepare("INSERT INTO Well_Levels VALUES (?,?,?)");
                list.forEach(function(entry){
                    stmt.run(entry.wellID, entry.depth, enty.date);
                    stmt.finalize();
                });
                
}

db.close();