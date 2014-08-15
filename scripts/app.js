'use strict';


angular.module('diem', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'webStorageModule',
  'firebase'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/new', {
        templateUrl: 'views/new.html',
        controller: 'NewCtrl'
      })
      .when('/edit/:task', {
        templateUrl: 'views/new.html',
        controller: 'EditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run([ '$firebaseSimpleLogin', '$firebase', '$rootScope', '$location', function ($firebaseSimpleLogin, $firebase, $rootScope, $location) {
    var ref = new Firebase('https://diem.firebaseio.com/');

    console.log($firebaseSimpleLogin);
    $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
      console.log(arguments);
      console.log(user);
      console.log("User " + user.id + " successfully logged in!");
      // var ref = new Firebase("https://diem.firebaseio.com/"+user.id);
      var sync = $firebase(ref.child(user.id));
      $rootScope.user = sync.$asObject();
      $rootScope.user.$loaded(function(user) {
        if(user.reset === undefined || user.reset < Date.now()){
          console.log("reset");
          if($rootScope.user.tasks){
            $rootScope.user.tasks.$remove();
          }
          $rootScope.user.reset = moment({hour:7}).valueOf()+86400000;
          $rootScope.user.$save('reset');
        }
        console.log("Initial data received!");
      });
      // console.log($scope.user);
      // $scope.user.test = "hello world";
      // $scope.user.$save("test");
    });
    $rootScope.$on("$firebaseSimpleLogin:error", function(e){
      console.log(e);
      console.log(arguments);
    });
    $rootScope.auth = $firebaseSimpleLogin(ref);
    console.log($rootScope.auth);
  }]);
