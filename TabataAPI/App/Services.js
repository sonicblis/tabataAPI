app.service('api', function ($resource) {
    this.Record = $resource('http://tabata.azurewebsites.net/api/record/:id',
        { id: '@id' },
        {
            list: { method: 'GET', isArray: true }, //same as query
            create: { method: 'POST', headers: { origin: 'http://run.plnkr.co' } }, // same as save
            update: { method: 'PUT' }
            // DEFAULT IMPLEMENTATION OF $RESOURCE
            //   'get':    {method:'GET'},
            //   'save':   {method:'POST'},
            //   'query':  {method:'GET', isArray:true},
            //   'remove': {method:'DELETE'},
            //   'delete': {method:'DELETE'}
        });
});

app.factory('$cookieManager', function () {
    function fetchValue(name) {
        var aCookie = document.cookie.split("; ");
        for (var i = 0; i < aCookie.length; i++) {
            // a name/value pair (a crumb) is separated by an equal sign
            var aCrumb = aCookie[i].split("=");
            if (name === aCrumb[0]) {
                var value = '';
                try {
                    value = angular.fromJson(aCrumb[1]);
                } catch (e) {
                    value = unescape(aCrumb[1]);
                }
                return value;
            }
        }
        // a cookie with the requested name does not exist
        return null;
    }
    return function (name, options) {
        if (arguments.length === 1) return fetchValue(name);
        var cookie = name + '=';
        if (typeof options === 'object') {
            var expires = '';
            cookie += (typeof options.value === 'object') ? angular.toJson(options.value) + ';' : options.value + ';';
            if (options.expires) {
                var date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                expires = date.toGMTString();
            }
            cookie += (!options.session) ? 'expires=' + expires + ';' : '';
            cookie += (options.path) ? 'path=' + options.path + ';' : '';
            cookie += (options.secure) ? 'secure;' : '';
        } else {
            cookie += options + ';';
        }
        document.cookie = cookie;
    }
});