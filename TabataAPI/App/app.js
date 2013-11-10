// Code goes here
var app = angular.module("tabata", ['ngResource']);

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

app.controller("CountdownController", function ($scope, api) {
    $scope.Pushups = '_off';
    $scope.Pullups = '_off';
    $scope.Squats = '_off';
    $scope.Situps = '_off';
    $scope.Message = "";
    $scope.GoMessage = "GO!";
    $scope.RestMessage = "Rest...";
    $scope.ReadyMessage = "Ready?";
    $scope.SegmentCount = 0;
    $scope.Total = '';
    $scope.Seconds = 4;
    $scope.Minutes = 4;
    $scope.Segments = [0, 1, 2, 3, 4, 5, 6, 7];
    $scope.AvailableAction = "Start";

    $scope.SetExercise = function (exercise) {
        $scope.ClearExercises();
        $scope[exercise] = '';
        $scope.Ready = true;
        $scope.Exercise = exercise;
    };

    $scope.ClearExercises = function () {
        $scope.Pushups = '_off';
        $scope.Pullups = '_off';
        $scope.Squats = '_off';
        $scope.Situps = '_off';
    };

    $scope.ChangeStatus = function () {
        if (!$scope.Ready) {
            alert('First, select your exercise');
            return;
        }
        if ($scope.AvailableAction == "Start" || $scope.AvailableAction == "Resume") {
            $scope.Start();
        }
        else if ($scope.AvailableAction == "Pause") {
            $scope.AvailableAction = "Resume";
            clearTimeout($scope.Timer);
        }
        else if ($scope.AvailableAction == "Reset") {
            $scope.Stop();
        }
    };

    $scope.Start = function () {
        if ($scope.Minutes === 4) {
            $scope.Message = "Ready?";
        }
        $scope.AvailableAction = "Pause";
        $scope.Timer = setInterval(function () { $scope.$apply($scope.TickTimer) }, 1000);
    };

    $scope.TickTimer = function () {
        $scope.CurrentTime = $scope.DecrementTime();
    };

    $scope.DecrementTime = function () {
        if (parseInt($scope.Minutes, 10) === 0 && parseInt($scope.Seconds, 10) === 9) {
            $scope.End();
        }
        else if (parseInt($scope.Seconds, 10) === 0) {
            $scope.Seconds = 59;
            $scope.Minutes--;
            $scope.UpdateMessage();
        }
        else {
            $scope.Seconds--;
            $scope.UpdateMessage();
        }
    };

    $scope.UpdateMessage = function () {
        if ($scope.Minutes < 4) {
            if ($scope.Seconds > 39 || ($scope.Seconds < 30 && $scope.Seconds > 9)) {
                if ($scope.Message == $scope.RestMessage || $scope.Message == $scope.ReadyMessage) {
                    $scope.PlaySound();
                }
                $scope.Message = $scope.GoMessage;
            }
            else {
                if ($scope.Message == $scope.GoMessage) {
                    $scope.SegmentCount++;
                    $scope.PlaySound();
                }
                $scope.Message = $scope.RestMessage;
            }
        }
    };

    $scope.PlaySound = function () {
        document.getElementById("whistle").play();
    };

    $scope.Stop = function () {
        clearTimeout($scope.Timer);
        $scope.Minutes = 4;
        $scope.Seconds = 4;
        $scope.AvailableAction = "Start";
        $scope.Message = "";
        $scope.SegmentCount = 0;
        $scope.Total = '';
    };

    $scope.End = function () {
        $scope.Message = "DONE!";
        $scope.AvailableAction = "Reset";
    };

    $scope.Exercise = '';

    $scope.Record = function () {
        return {
            Count: $scope.Total,
            Exercise: $scope.Exercise(),
            When: new Date(),
            Id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); })
        };
    };

    //$scope.Records = api.Record.query();

    $scope.Records = [{
        Count: 10,
        Exercise: 'Pushups',
        When: new Date().toDateString(),
        Id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); })
    }, {
        Count: 20,
        Exercise: 'Pushups',
        When: new Date().toDateString(),
        Id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); })
    }, {
        Count: 30,
        Exercise: 'Pullups',
        When: new Date().toDateString(),
        Id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); })
    }, {
        Count: 40,
        Exercise: 'Pullups',
        When: new Date().toDateString(),
        Id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); })
    }]

    $scope.DeleteRecord = function (record) {
        if (confirm('you wanna delete this record?')) {
            api.Record.delete(record, function () {
                $scope.Records = _.without($scope.Records, record);
            });
        }
    };

    $scope.SaveResults = function ($event) {
        if ($event.keyCode == 13 && $scope.Total !== '') {
            api.Record.create($scope.Record(), function () {
                $scope.Records.unshift($scope.Record);
            });
        }
    };
});