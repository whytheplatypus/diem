'use strict';

angular.module('42dayApp').filter('markdown', function() {
  return function(input) {
  	console.log("filtering ", input);
    return marked(input);
  };
});