# RainMap
West India Farmer Rain Data Visualization WebApp


To run on Local:
$node farmRainMapApp.js
launches webapp on port 8888
navigate URL to localhost:8888/Well_Levels

To run on server:
See INSTRUCTIONS

working map view is found in views/google-maps.html

Well data is stored in RAINAPP.db
SCHEMA
Well_History: (ID, TOT_WELL_DEPTH_m, T_STAMP)
Well_Locations: (ID, LAT_DEGREE, LAT_MINUTE, LAT_SECOND, LAT_DECIMAL, LNG_DEGREE, LNG_MINUTE, LNG_SECOND, LNG_DECIMAL  ELEVATION_m) 
LastReading: (ID, DATE)
LastReading will be used to query latest reading from db. 

TODO:// 
1)
Server SMS dump
Create server routine to parse smsdump every 24 and update RAINAPP.db


2)
Tune visual features on map. 
Is the radius to large? should it remain the same size when zooming?
Mouseover launch info window popup to mouseclick ?
Change icon colors of level is below a certain level?

3)Modify Lat Long conversion to handle decimal in calculation in farmRainMapApp.js. The decimal is added to the conversiont at the sesconds level EX:
Degree + Minutes/60 +  ('Seconds' + 'Decimal')/3600


 