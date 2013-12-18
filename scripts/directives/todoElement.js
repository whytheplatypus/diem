angular.module('42dayApp').directive('todoElement', ['$rootScope', function($rootScope) {
      return {
        restrict: 'E',
        require: '?ngModel',
        scope: {
          task: '=ngModel',
        },
        link: function(scope, element, attrs, ngModel) {
          console.log(arguments);
          console.log("linked");
          element[0].addEventListener('complete:changed', function(e){
            console.log(e.detail);
            scope.$apply(function(){
              scope.task.complete = e.detail.value;
              $rootScope.user.$save('tasks');
            });
          })
        }
      };
    }]);