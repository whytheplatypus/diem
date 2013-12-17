"use strict";angular.module("42dayApp",["ngCookies","ngResource","ngSanitize","ngRoute","webStorageModule","firebase"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/new",{templateUrl:"views/new.html",controller:"NewCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("42dayApp").filter("markdown",function(){return function(a){return console.log("filtering ",a),marked(a)}}),angular.module("42dayApp").directive("todoElement",["$rootScope",function(a){return{restrict:"E",require:"?ngModel",scope:{task:"=ngModel"},link:function(b,c){console.log(arguments),console.log("linked"),c[0].addEventListener("complete:changed",function(c){console.log(c.detail),b.$apply(function(){b.task.complete=c.detail.value,a.user.$save("tasks")})})}}}]),angular.module("42dayApp").factory("Task",["webStorage","$firebase","$rootScope",function(a,b,c){var d=function(a,b){this.item=a,this.content=b,this.created=Date.now(),this.complete="incomplete"};return d.prototype.save=function(){c.user.tasks||(c.user.tasks={}),c.user.tasks[this.created]=this,c.user.$save()},d.forget=function(){a.clear()},d.load=function(){},d}]),angular.module("42dayApp").controller("MainCtrl",["$scope","webStorage","Task","$firebaseAuth","$firebase","$rootScope",function(a,b,c,d,e,f){var g=new Firebase("https://diem.firebaseio.com/");f.$on("$firebaseAuth:login",function(a,b){console.log(b),console.log("User "+b.id+" successfully logged in!"),f.user=e(g).$child(b.id),f.user.$on("loaded",function(a){(void 0===a.reset||a.reset<Date.now())&&(console.log("reset"),f.user.$remove("tasks"),f.user.reset=moment({hour:7}).valueOf()+864e5,f.user.$save("reset")),console.log("Initial data received!")})}),a.auth=d(g),console.log(a.auth),a.login=function(){a.auth.$login("persona")}}]),angular.module("42dayApp").controller("NewCtrl",["$scope","webStorage","Task","$location",function(a,b,c,d){a.task=new c("new task","stuff to do"),a.save=function(){a.task.save(),d.path("/")}}]);