# www/js/controllers/playerprofilesctrl.js

This file contains methods implementing behaviour on the player profiles screen.

## Methods

**`format_date(date_int)`**

Return formatted date string converted from UNIX time.

**date_int**: UNIX time in seconds.
<hr>

**`chartData(match)`**

Format match data to be inputted to chart.

**match**: Match data.
<hr>

**`drawChart(chartdata)`**

Uses Google Charts API to draw profile charts.

**chartdata**: Data to draw on chart.
<hr>

**`displayProfile(data)`**

Update screen with profile data.

**data**: JSON object of player profile data from SquashLevels.
<hr>
