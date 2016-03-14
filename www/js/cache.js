/* cache.js */

/* Object containing cache functions */
var Cache = {

    /* Master local storage key */
    masterkey: "squash_master",

    /* Initialise cache if not used before */
    initialize: function() {
        /* Check if masterkey already exists */
        if (localStorage.getItem(this.masterkey) == null) {
            /* Master key object contains list of key elements */
            var objMaster = {
                keys: []
            };

            /* Set master key object in local storage */
            localStorage.setItem(this.masterkey, JSON.stringify(objMaster));
        }
    },

    /* Insert into cache */
    insert: function(k, v) {
        /* Call delete method to remove element if it already exists */
        this.delete(k);

        /* New master key element */
        var objNewElement = {
            key: k,
            time: Date.now()
        };

        /* Get keylist from master key and add new element */
        var objMaster = JSON.parse(localStorage.getItem(this.masterkey));
        objMaster.keys.push(objNewElement);

        /* Set master key in local storage */
        localStorage.setItem(this.masterkey, JSON.stringify(objMaster));

        /* Set key-value pair in storage */
        localStorage.setItem(k, v);
    },

    /* Clean the cache */
    clean: function(time) {
        /* Get keylist from master key */
        var objMaster = JSON.parse(localStorage.getItem(this.masterkey));

        /* Iterate over keylist */
        for (var i = 0; i < objMaster.keys.length; i++) {
            /* Calculate age of element */
            var lastUpdated = objMaster.keys[i].time;
            var age = Date.now() - lastUpdated;

            /* Delete elements that haven't been updated for a week */
            if (age > time) {
                Cache.delete(objMaster.keys[i].key);
            }
        }
    },

    /* Request data from cache */
    request: function(k, callbackDone, callbackFail) {
        /*add proxy*/    
        k = "https://crossorigin.me/" + k + "&appid=SL2.0"

        /* Make AJAX request */
        var data = $.ajax({
            url: k
        }).done(function(){
            /* If request succeeds, insert data into cache and execute cache */
            Cache.insert(k, data.responseText);
            callbackDone(data.responseText);
        }).fail(function(){
            /* If the request fails, try to get data from the cache */
            var data = localStorage.getItem(k);

            /* If no data was found, execute the failure callback */
            if (data == null) {
                callbackFail();
            }
            /* Otherwise return data */
            else {
                callbackDone(data);
            }
        });
    },

    /* Delete key from cache */
    delete: function(k) {
        /* Get keylist from master key */
        var objMaster = JSON.parse(localStorage.getItem(this.masterkey));

        /* Remove element with key k from list of keys */
        for (var i = 0; i < objMaster.keys.length; i++) {
            if (objMaster.keys[i].key === k) {
                objMaster.keys.splice(i, 1);
                break;
            }
        }

        /* Set master key in local storage */
        localStorage.setItem(this.masterkey, JSON.stringify(objMaster));

        /* Remove item from local storage */
        localStorage.removeItem(k);
    }

};
