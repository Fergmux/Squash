# www/js/controllers/loginctrl.js

This file contains methods implementing behaviour on the login screen.

## Methods

**`login(email, pass)`**

Cache username and password and perform login request.

**email**: String of login email.

**pass**: String of login password.
<hr>

**`loadUserData(data)`**:

Parse user profile JSON object,, cache it and go to `myProfile` screen.

**data**: User profile JSON object.
<hr>

**`$scope.loginTap()`**:

Callback to perform login when button is pressed.
