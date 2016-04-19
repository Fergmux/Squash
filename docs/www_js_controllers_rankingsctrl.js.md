# www/js/controllers/rankingsctrl.js

This file contains methods implementing behaviour on the rankings screen.

## Methods

**`$scope.onTap()`**

Callback function to hide results, reload data and hide filters when search button is pressed.
<hr>

**`$scope.toggleFilters()`**

Callback function to toggle filters when filters button is pressed.
<hr>

**`displayRank(rank)`**:

Display ranking data as a list on the page.

**rank**: JSON object of ranking data from SquashLevels.
<hr>

**`$scope.tapped(id)`**:

Switches to player profile page when you click on a player.

**id**: Player ID of player tapped.
<hr>

**`changeHiddenInput()`**

Get dropdown inputs and load ranking data with call to `loadRanking()`.
<hr>

**`loadRanking()`**

Request ranking data from SquashLevels if available, or the Cache if available.
<hr>
