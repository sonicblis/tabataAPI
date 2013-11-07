app.directive('focusWhen', function ($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusWhen);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
});

app.directive('chart', function () {
    return {
        link: function (scope, element, attrs) {
            console.log('scope', scope);

            scope.$watch('data', function (value) {
                var labels = [], data = [];
                for (var i in value) {
                    labels.push(value[i].Label);
                    data.push(value[i].Count);
                }

                var ctx = document.getElementById("PushupChart").getContext("2d");
                var myNewChart = new Chart(ctx).Line({
                    labels: labels,
                    datasets: [
                        {
                            fillColor: "rgba(110,110,110,0.5)",
                            strokeColor: "rgba(110,110,110,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#444",
                            data: data
                        }
                    ]
                });
            }, true);
        },
        restrict: 'E',
        templateUrl: 'chart.html',
        scope: {
            data: '=',
            label: '@'
        }
    };
});