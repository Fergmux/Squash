# www/js/controllers/myprofilectrl.js

This file contains methods implementing behaviour on the my profile screen.

## Methods

**`getPlayerInfo(playerid)`**

Request player data from SquashLevels if available, or from the Cache if available.

**playerid**: Player ID.
<hr>


**`formatChart(match)`**

Format match data to be inputted to chart.

**match**: Match data.
<hr>

**`drawChart(chartData)`**

Uses Google Charts API to draw profile charts.

**chartData**: Data to draw on chart.
<hr>

**`displayPlayerData(data)`**

Update screen with profile data.

**data**: JSON object of player profile data from SquashLevels.
<hr>
