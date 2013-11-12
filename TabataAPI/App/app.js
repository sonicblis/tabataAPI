var app = angular.module("tabata", ['ngResource']);

app.controller("CountdownController", function ($scope, api, $cookieManager) {
	function NewGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
	}

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

	$scope.AuthenticateUser = function () {
		api.Users.find({ username: $scope.Email, password: $scope.Password }, function (result) {
			$scope.SetUser(result.Id);
			$scope.GetRecords();
		}, function (result) {
			if (result.status === 404) {
				alert('that e-mail and password doesn\'t exist');
			};
		});
	};

	$scope.Guard = function (val) {
		return (val !== undefined && val !== null && val !== '');
	}

	$scope.CreateUser = function () {
		if (!$scope.Guard($scope.Email) || !$scope.Guard($scope.UserName) || !$scope.Guard($scope.Password)) {
			alert('Come on.  You can\'t make a profile without all the fields filled in.');
		}
		else {
			var newUser = {
				Id: NewGuid(),
				Name: $scope.UserName,
				Email: $scope.Email,
				Password: $scope.Password
			};
			api.Users.save(newUser,
                function (result) {
                	$scope.SetUser(newUser.Id);
                	$scope.GetRecords();
                },
                function (result) {
                	if (result.status == 409) {
                		alert('That e-mail is already in use.');
                	}
                	else {
                		alert('There was a tragic error (errorcode: ' + result.status + ') trying to create your account.');
                	}
                }
            );
		}
	};

	$scope.UserId = $cookieManager('auth');

	$scope.SetUser = function (id) {
		$cookieManager('auth', {
			value: id,
			expires: 120
		});
		$scope.UserId = $cookieManager('auth');
	}

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
		else if ($scope.AvailableAction == "Save") {
			$scope.SaveResults();
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
		$scope.AvailableAction = "Save";
	};

	$scope.Exercise = '';

	$scope.Record = function () {
		return {
			Count: $scope.Total,
			Exercise: $scope.Exercise,
			When: new Date(),
			User: { Id: $scope.UserId },
			Id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); })
		};
	};

	$scope.Records = [];

	$scope.GetRecords = function () {
		$scope.Records = api.Records.query({ userId: $scope.UserId });
	};

	$scope.DeleteRecord = function (record) {
		if (confirm('you wanna delete this record?')) {
			api.Records.delete(record, function () {
				$scope.GetRecords();
			});
		}
	};

	$scope.KeyPress = function ($event) {
		if ($event.keyCode == 13) {
			$scope.SaveResults();
		};
	}

	$scope.SaveResults = function () {
		if ($scope.Total !== '') {
			api.Records.save(
                $scope.Record(),
                function () {
                	$scope.Records.unshift($scope.Record);
                	$scope.Stop();
                	$scope.GetRecords();
                },
                function (result) {
                	alert('oh... oh no.  There\'s been an error (code: ' + result.status + ')');
                	console.log(result);
                }
            );
		}
	};

	if ($scope.UserId != undefined) {
		$scope.GetRecords();
	}
});