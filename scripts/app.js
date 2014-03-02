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
  }).run([ '$firebaseAuth', '$firebase', '$rootScope', '$location', function ($firebaseAuth, $firebase, $rootScope, $location) {
    var ref = new Firebase('https://diem.firebaseio.com/');
    console.log($firebaseAuth);
    $rootScope.$on("$firebaseAuth:login", function(e, user) {
      console.log(arguments);
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
    $rootScope.$on("$firebaseAuth:error", function(e){
      console.log(e);
      console.log(arguments);
    });
    $rootScope.auth = $firebaseAuth(ref);
    console.log($rootScope.auth);
  }]);
