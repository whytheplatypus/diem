'use strict';

angular.module('diem')
  .controller('NewCtrl', ['$scope', 'webStorage', 'Task', '$location', function ($scope, webStorage, Task, $location) {
    	$scope.task = new Task();
    	$scope.save = function(){
    		$scope.task.save();
			  $location.path( "/" );
    	}
    }]);
