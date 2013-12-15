'use strict';

angular.module('42dayApp')
  .factory( 'Task', ['webStorage', '$firebase', '$rootScope', function(webStorage, $firebase, $rootScope){
    var Task = function(item, content){
      this.item = item;
      this.content = content;
      this.created = Date.now();
      this.complete = 'incomplete';
    };
    Task.prototype.save = function() {
  //    var tasks = webStorage.get('tasks');
    // if(!tasks){
    //  tasks = [];
    // }
    // tasks.push(this.created);
    // webStorage.add('tasks', tasks);
    // webStorage.add(this.created, this);
    if(!$rootScope.user.tasks){
      $rootScope.user.tasks = {}

    }
    $rootScope.user.tasks[this.created] = this;
    $rootScope.user.$save();
    
    };

    Task.forget = function() {
      webStorage.clear();
    };

    Task.load = function(user){

    }

    return Task;
  }]);
