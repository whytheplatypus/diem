'use strict';

angular.module('diem').filter('markdown', function() {
  return function(input) {
  	console.log("filtering ", input);
    return marked(input);
  };
});