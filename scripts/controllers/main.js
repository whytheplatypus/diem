'use strict';

angular.module('diem')
  .controller('MainCtrl', ['$scope', 'webStorage', 'Task', '$firebaseAuth', '$firebase', '$rootScope', '$location', function ($scope, webStorage, Task, $firebaseAuth, $firebase, $rootScope, $location) {
  	
    
    $scope.login = function(){
    	$rootScope.auth.$login('persona');
    }

    $scope.edit = function(e, task){
      e.preventDefault();
      console.log("test");
      $location.path( "/edit/"+task.created );
    }
 //    var tasks = webStorage.get('tasks');
 //    $scope.tasks = [];
 //    if(tasks[tasks.length-1] < moment({hour: 7}).valueOf()){
	// 	Task.forget();
	// } else {
	//     for(var i = 0; i < tasks.length; i++){
	//     	var task = webStorage.get(tasks[i]);
	//     	$scope.tasks.push(new Task(task.item, task.content));
	//     }
 //    }
  }]);
