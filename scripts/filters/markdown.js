'use strict';

angular.module('diem').filter('markdown', function() {
  return function(input) {
  	console.log("filtering ", input);
  	var result;
  	try{
  		result = marked(input);
	} catch(e){
		result = e;
	}
    return result
  };
});