'use strict';

angular.module('diem')
  .controller('MainCtrl', ['$scope', 'webStorage', 'Task', '$firebaseAuth', '$firebase', '$rootScope', '$location', function ($scope, webStorage, Task, $firebaseAuth, $firebase, $rootScope, $location) {

    $scope.needs_trello = true;

    Trello.authorize({
      interactive:false,
      success: onAuthorize
    });
    function onAuthorize(){
      $scope.needs_trello = false;
      console.log(arguments);
      Trello.members.get("me", {cards: "all"}, function(member){
        console.log(member);
      });
    }

    $scope.connectTrello = function(){
      Trello.authorize({
          type: "popup",
          success: onAuthorize
      })
    }

    $scope.login = function(){
      console.log($rootScope.auth.$login);

    	$rootScope.auth.$login('google', {preferRedirect: true, rememberMe:true});
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
