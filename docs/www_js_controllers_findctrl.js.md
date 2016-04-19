# www/js/controllers/findctrl.js

This file contains methods implementing behaviour on the find screen.

## Methods
**`$("#char_press").keydown(e)`**:

Callback to add keypressed to search string.

**e**: Keypress event.
<hr>

**`getKey()`**

Calculate security key for submitting data.
<hr>

**`createAutoList(data)`**

Given a SquashLevels JSON string ontaining a list of players, generate the autocomplete array for the name search field.

**data**: JSON string list of players such as that returned by request to `http://www.squashlevels.com/info.php?action=find&name=richard&format=json`.
<hr>


**`createPlayerIdArray(data)`**

Given a SquashLevels JSON object containing a list of players, generate an array of playerIDs which can be used for lookup.

**data**: JSON string list of players such as that returned by request to `http://www.squashlevels.com/info.php?action=find&name=richard&format=json`.
<hr>

**`loadPlayerList(search_string)`**

Load list of players from SquashLevels given the search string *search_string*. Calls `createAutoList()` to generate autocomplete data and `createPlayerIDArray()` to generate array of player IDs for lookup.

**search_string**: String containing search term.
<hr>

**`$scope.tapped(id)`**

Callback for submitting search when you tap on a player.

**id**: Player ID of player tapped.
