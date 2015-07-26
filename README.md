# RainMap
West India Farmer Rain Data Visualization WebApp


To run:
$node farmRainMapApp.js
launches webapp on port 8888
navigate URL to localhost:8888/Well_Levels

working map view is found in views/google-maps.html

Well data is stored in RAINAPP.db

TODO:// 
1)
Server SMS dump
open port on :URL/smsdump to listen for POST sms
write sms to smsdump.txt
Create server routine to parse smsdump every 24 and update RAINAPP.db

2)
Create another table in RAINAPP.db CURRENTREADINGS
WELLID, DATE

This will be used to query latest reading from db. Node sql query will need modification to handle new table. 

3)
Tune visual features on map. 
Is the radius to large? should it remain the same size when zooming?
Mouseover launch info window popup to mouseclick ?
Change icon colors of level is below a certain level?
