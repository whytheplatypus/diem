'use strict';

angular.module('diem')
  .controller('EditCtrl', ['$scope', 'webStorage', 'Task', '$location', '$rootScope', '$routeParams', function ($scope, webStorage, Task, $location, $rootScope, $routeParams) {
    	try{
    		$scope.task = $rootScope.user.tasks[$routeParams.task];
	    } catch(e){
	    	console.log('error:', e);
	    }
    	$scope.$watch('user.tasks', function(){
    		console.log("user changed");
    		try{
	    		$scope.task = $rootScope.user.tasks[$routeParams.task];
		    } catch(e){
		    	console.log('error:', e);
		    }
    	});


    	$scope.save = function(){
    		$rootScope.user.$save('tasks');
			$location.path( "/" );
    	}
    }]);
