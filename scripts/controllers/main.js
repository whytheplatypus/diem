'use strict';
angular.module('diem')
  .controller('MainCtrl', ['$scope', 'webStorage', 'Task', '$rootScope', '$location', function ($scope, webStorage, Task, $rootScope, $location) {

    $scope.login = function(){
      console.log($rootScope.auth.$login);

    	$rootScope.auth.$login('google');
    }

    $scope.toggleComplete = function(task, event){
      event.preventDefault();
      // console.log(task);
      task.complete = task.complete=="complete"?"incomplete":"complete";
      $rootScope.user.$save('tasks');
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
