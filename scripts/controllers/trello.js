'use strict';
angular.module('diem')
  .controller('TrelloCtrl', ['$scope', 'webStorage', 'Task', '$location', function ($scope, webStorage, Task, $location) {

    $scope.save = function(){
      $scope.task.save();
      $location.path( "/" );
    }
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
        $scope.member = member;
        if(!$scope.$$phase){
          $scope.$apply();
        }
      });
    }

    $scope.connectTrello = function(){
      Trello.authorize({
          type: "popup",
          success: onAuthorize
      })
    }

    $scope.addTask = function(card, event){
      event.preventDefault();
      console.log(card);
      var task = new Task();
      task.item = card.name;
      task.content = card.desc;
      task.save();
    }
  }]);
