'use strict';

angular.module('42dayApp')
  .controller('NewCtrl', ['$scope', 'webStorage', 'Task', '$location', function ($scope, webStorage, Task, $location) {
    	$scope.task = new Task('new task', 'stuff to do');
    	$scope.save = function(){
    		$scope.task.save();
			$location.path( "/" );
    	}
    }]);
