app.filter("Pad", function () {
    return function (input, desiredLength, padWith) {
        var returnString = input.toString();
        while (returnString.length < desiredLength) {
            returnString = padWith + returnString;
        }
        return returnString;
    };
});

var cache = {};
app.filter('Only', function () {
    return function (input, exercise) {
        cacheString = exercise + input.length.toString();
        if (!cache[cacheString]) {
            cache[cacheString] = _.where(input, { Exercise: exercise });
            return cache[cacheString];
        }
        else{
            return cache[cacheString];
        }
    };
});