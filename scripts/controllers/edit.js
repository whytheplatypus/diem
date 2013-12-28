'use strict';

angular.module('diem')
  .controller('EditCtrl', ['$scope', 'webStorage', 'Task', '$location', '$rootScope', '$routeParams', function ($scope, webStorage, Task, $location, $rootScope, $routeParams) {
    	$scope.task = $rootScope.user.tasks[$routeParams.task];
    	$scope.save = function(){
    		$rootScope.user.$save('tasks');
			$location.path( "/" );
    	}
    }]);
