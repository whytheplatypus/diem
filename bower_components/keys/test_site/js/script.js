/* Author:

*/
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};
var test_keys = new Keys(document.getElementById('test'),[
    {value: 'not equal', display: '$ \\ne $'},
    {value: 'sqrt({{selection}})',
     display: '$ \\sqrt{} $',
     // behavior:
     //    function(input){
     //        console.log("running");
     //        var startPos = input.selectionStart;
     //        var endPos = input.selectionEnd;
     //        selectedText = input.value.substring(startPos, endPos)
     //        if(selectedText.length > 0){
     //            return 'sqrt('+selectedText+')';
     //        } else {
     //            input.selectionStart -= 1;
     //            input.selectionEnd -= 1;
     //            return 'sqrt()';
     //        }
     //        //this.focus();
     //    }
    },'{','}','[',']','%', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a','a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'b'],{debug:true});





