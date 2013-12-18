'use strict';

angular.module('42dayApp')
  .controller('MainCtrl', ['$scope', 'webStorage', 'Task', '$firebaseAuth', '$firebase', '$rootScope', function ($scope, webStorage, Task, $firebaseAuth, $firebase, $rootScope) {
  	var ref = new Firebase('https://diem.firebaseio.com/');
  	$rootScope.$on("$firebaseAuth:login", function(e, user) {
  		console.log(user);
	  	console.log("User " + user.id + " successfully logged in!");
	  	// var ref = new Firebase("https://diem.firebaseio.com/"+user.id);
  		$rootScope.user = $firebase(ref).$child(user.id);
      $rootScope.user.$on("loaded", function(user) {
        if(user.reset === undefined || user.reset < Date.now()){
          console.log("reset");
          $rootScope.user.$remove('tasks');
          $rootScope.user.reset = moment({hour:7}).valueOf()+86400000;
          $rootScope.user.$save('reset');
        }
        console.log("Initial data received!");
      });
  		// console.log($scope.user);
  		// $scope.user.test = "hello world";
  		// $scope.user.$save("test");
	  });
  	
    $scope.auth = $firebaseAuth(ref);
    console.log($scope.auth);
    
    $scope.login = function(){
    	$scope.auth.$login('persona');
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
