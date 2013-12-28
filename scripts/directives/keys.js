
angular.module('diem').directive('keys', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    require: '?ngModel',
    scope: {
      task: '=ngModel',
    },
    link: function(scope, element, attrs, ngModel) {
      console.log("loading keys?");
      console.log(element);
    	var test_keys = new Keys(element[0], [
		    {value: '**<%=selection%>**',
		     display: '<b>B</b>',
		     behavior: function(){
		     	element.trigger('input');
		     },
		    {value: '#<%=selection%>',
		     display: '<h1>H1</h1>',
		     behavior: function(){
		     	element.trigger('input');
		     },
		    {value: '[<%=selection%>]()',
		     display: 'link',
		     behavior: function(){
		     	element.trigger('input');
		     }
		    }], {debug:true});
    }
  };
}]);