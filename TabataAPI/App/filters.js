app.filter("Pad", function () {
    return function (input, desiredLength, padWith) {
        var returnString = input.toString();
        while (returnString.length < desiredLength) {
            returnString = padWith + returnString;
        }
        return returnString;
    };
});

app.filter('Only', function () {
    return function (input, exercise) {
        return _.where(input, { Exercise: exercise });
    };
});