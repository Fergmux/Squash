# www/js/controllers/custommatchctrl.js

This file contains methods implementing behaviour on the custom match screen.

## Methods

**`setDateInput()`**

Set the match date as the current date.
<hr>

**`$("#name1, #name").keydown(e)`**

Callback function to add keys pressed to search string.

**e**: Keypress event.
<hr>

**`getKey()`**

Calculate security key for submitting data.
<hr>

**`createAutoList(data, id)`**

Given a SquashLevels JSON string ontaining a list of players, generate the autocomplete array for the name search field and ID lookup.

**data**: JSON string list of players such as that returned by request to `http://www.squashlevels.com/info.php?action=find&name=richard&format=json`.

**id**: Player ID 
<hr>


**`createPlayerIdArray(data)`**

Given a SquashLevels JSON object containing a list of players, generate an array of playerIDs which can be used for lookup.

**data**: JSON string list of players such as that returned by request to `http://www.squashlevels.com/info.php?action=find&name=richard&format=json`.
<hr>

**`loadPlayerList(search_string, id)`**

Load list of players from SquashLevels given the search string *search_string*. Calls `createAutoList()` to generate autocomplete data and `createPlayerIDArray()` to generate array of player IDs for lookup.

**search_string**: String containing search term.

**id**: Player ID
<hr>

**`$scope.scoreBtnCallback(btn, add)`**

Callback function to increment/decrement score values when the score modification buttons are pressed.

**btn**: The button who's value we should modify. Valid values are "1a", "1b", "2a", "2b" ... "5a", "5b"

**add**: The value to add to the button.
<hr>

**`checkScores()`**

Checks the current value of the scores to determine who is winning each round. Makes a call to `updateRounds()` to display the current round scores.
<hr>

**`updateRounds()`**

Display the amount of rounds each player has won.
<hr>

**`$scope.submitScores()`**

Callback when submit button is pressed. Makes a call to `checkNames()`.
<hr>

**`checkNames()`**

Checks that all players in the match are registered with SquashLevels. If successful, match details are cleared from the screen with a call to `clearPage()`. Otherwise, an error is display with `popAlert()`.
<hr>

**`popAlert(text)`**

Display an alert message.

**text**: String to display as alert message.
<hr>

**`clearPage()`**

Clear all information from fields on the page.
