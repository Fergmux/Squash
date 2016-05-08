# www/js/cache.js

This file contains methods implementing Cache behaviour.

## Methods

**`Cache.initialize()`**

Initialize Cache by creating a masterkey in local storage, the value of which lists the keys stored by the application.
<hr>

**`Cache.insert(k, v)`**

Insert a key-value pair into the Cache, tagged with the insert date.

**k**: Key to use when retrieving value.

**v**: Value to retrieve by key.
<hr>

**`Cache.clean(time)`**

Removes all key-value pairs from the Cache older than `time`.

**time**: Age at which to remove items, given as UNIX time in milliseconds.
<hr>

**`Cache.request(k, callbackDone, callbackFail)`**

Tries to request data from URL. If successful, the data is Cached and `callbackDone` is called. If unsuccessful, tries to retrieve previously Cached data. If available, `callbackDone` is called. If unavailable, `callbackFail` is called.
<hr>

**`Cache.delete(k)`**

Delete a key-value pair from the Cache.

**k**: Key for key-value pair to remove.
