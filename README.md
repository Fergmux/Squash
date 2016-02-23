<<<<<<< HEAD
Ionic App Base
=====================

A starting project for Ionic that optionally supports using custom SCSS.

## Using this project

We recommend using the [Ionic CLI](https://github.com/driftyco/ionic-cli) to create new Ionic projects that are based on this project but use a ready-made starter template.

For example, to start a new Ionic project with the default tabs interface, make sure the `ionic` utility is installed:

```bash
$ npm install -g ionic
```

Then run:

```bash
$ ionic start myProject tabs
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page and the [Ionic CLI](https://github.com/driftyco/ionic-cli) repo.

## Issues
Issues have been disabled on this repo, if you do find an issue or have a question consider posting it on the [Ionic Forum](http://forum.ionicframework.com/).  Or else if there is truly an error, follow our guidelines for [submitting an issue](http://ionicframework.com/submit-issue/) to the main Ionic repository.
=======
# Squash
>>>>>>> 5d4ebc6056653ff89f1246a128697251ef2faf9a


# Cache.js

### Cache.initialize()

Call this when the app loads to make sure the master key object has been stored in HTML5 localStorage.

```
Cache.initialize()
```


### Cache.request(url, callbackDone, callbackFail)

All external data requests should be made through this function. First the cache will attempt to update it's version of the data through a normal AJAX request to the given `url`. If this is not successful, the cache will attempt to retrieve previously stored data.

If one of these succeed, the method passed as the argument `callbackDone` will be called and the successfully retrieved data passed as its argument, whether from the new request or the cache storage.

If neither of these succeed, the method passed as the argument `callbackFail` will be called.


```
Cache.request(url, callbackDone, callbackFail)

    - (String)    url           :  The AJAX request URL
    - (Function)  callbackDone  :  Function to call on success
    - (Function)  callbackFail  :  Function to call on failure
```

### Cache.clean(time)

This function can be used to prevent old, rarely used data from cluttering up the cache. Any object stored in the cache older than the parameter ```time``` (in milliseconds) will be deleted.

```
Cache.clean(time)

    - (Long)      time          :  Maximum allowed age in milliseconds
```
