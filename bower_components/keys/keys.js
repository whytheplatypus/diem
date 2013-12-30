(function (window) {
    "use strict";

    /**
     * Create a new Keys object
     *
     * options:
     * 
     * @constructor
     * @param {Object} syms The json object describing the symbols for the keyboard.
     * @param {Object} opt Options (need to document these)
     * @return {Object} exports for chaining
     */
    var Keys = function (el, syms, opt) {

        if(_ === undefined){
            console.log("this library requires underscore.js");
            throw "underscore.js (_) not found";
        }

        this.symbols = syms;
        this.options = opt ? opt : {};

        //we haven't rendered anything yet
        this.board = false;
        this.input = el; //the currently focused input

        this.keys = new Array();
        //create the keys
        for (var i = this.symbols.length - 1; i >= 0; i--) {
            this.addKey(this.symbols[i]);
        };
        
        if(!this.options.buildLater){
            this.build();
        }

        return this;
    };


    /**
     * Add a Key
     *
     * @param {Object} key The symbol to turn into a key, or a Key object
     * @return {Object} returns the created key for modification.
     */
    Keys.prototype.addKey = function(key){
        var self = this;
        var newKey = (key instanceof Keys.Key)?key:new Keys.Key(key);
        
        var keyReleased = function(){
            newKey.hitButton(self.input);
        }
        newKey.button.addEventListener('touchend', keyReleased, false);
        if (self.options.debug && !Keys.isMobile()) {
            newKey.button.addEventListener('click', keyReleased, false);
        }

        self.keys.push(newKey);
        return newKey;
    }

    /**
     * Check if the keyboard element has class cls attached to it
     *
     * @param {String} cls A class to check for
     * @return {Boolean} true if the class exists false otherwise
     */
    Keys.prototype.hasClass = function (cls) {
        return this.board.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    /**
     * add a class to the keyboard if it doesn't already have it
     * uses hasClass
     *
     * @param {String} cls A class to add
     */
    Keys.prototype.addClass = function (cls) {
        if (!this.hasClass(cls)) this.board.className += " " + cls;
    }

    /**
     * Remove a class to the keyboard
     * uses hasClass
     *
     * @param {String} cls A class to remove
     */
    Keys.prototype.removeClass = function (cls) {
        if (this.hasClass(cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            this.board.className = this.board.className.replace(reg, ' ');
        }
    }

    /**
     * Update the orientation of the device
     *
     * @return {String} returns the string of the current orientation.
     */
    Keys.prototype.orientation = function () {
        if (window.orientation == 0 || 180) {
            this.removeClass("landscape");
            this.addClass("portrait");
            return "portrait";
        } else {
            this.removeClass("portrait");
            this.addClass("landscape");
            return "landscape";
        }
        
    }

    /**
     * Inserts the given text into the text element at the current cursor position.
     * For use with elements that don't support replaceRange
     *
     * @param {Element} a html editable element.
     * @param {String} the text to insert.
     */
    Keys.insertAtCaret = function(el,template) {
        var txtarea = el;
        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        strPos = txtarea.selectionStart;
        var front = (txtarea.value).substring(0,strPos);  
        var back = (txtarea.value).substring(txtarea.selectionEnd,txtarea.value.length); 

        var selectedText = txtarea.value.substring(txtarea.selectionStart, txtarea.selectionEnd);
        var text = template({selection: selectedText});

        txtarea.value = front+text+back;
        strPos = strPos + text.length;
        txtarea.selectionStart = strPos
        txtarea.selectionEnd = strPos;
        txtarea.focus();
        txtarea.scrollTop = scrollPos;
        return true;
    }

    /**
     * Ataches blur and focus listeners to *inputs*
     * to control showing and hiding the keyboard.
     *
     * @param {Array} inputs An Array of inputs, should be text areas, fields, content editable areas etc.
     */
    Keys.prototype._attachInputListeners = function(){
        var self = this;

        
        // @todo Code mirror specific code
         
        // currentMirror.setOption('onFocus', function () {
        //     self.input = currentMirror;
        //     self.show();
        // });
        // currentMirror.setOption('onBlur', function () {
        //     self.hide();
        // });

        self.input.addEventListener('focus', function () {
            self.show();
        }, false);
        self.input.addEventListener('blur', function () {
            self.hide();
        }, false);
    };

    /**
     * Constructs the actual virtual keyboard.
     *
     * @todo  rebuild
     */
    Keys.prototype.build = function () {
        var self = this;
        //show if we're mobile
        if (this.options.debug || Keys.isMobile) {
            if (!self.board) {
                self.board = document.createElement('div');
                self.board.className = "keyboard";
                document.body.appendChild(self.board);
                //prevent wierd iOS behavior
                self.board.addEventListener('selectstart', function(event){event.preventDefault(); return false;}, false);
                self.board.addEventListener('select', function(event){event.preventDefault(); return false;}, false);
            }
            //create the keys
            self.keys.forEach(function (key) {
                self.board.appendChild(key.button);
            });


            //get orientation
            self.orientation();
            document.body.addEventListener('orientationchange', function (event) {
                self.orientation();
            }, false);
            
            self._attachInputListeners();

            window.addEventListener('scroll', function () {
                if (self.input) {
                    self.board.style.top = window.pageYOffset + "px";
                    self.board.style.left = window.pageXOffset + "px";
                }
            }, false);
            window.addEventListener('resize', function () {
                if (self.input) {
                    self.board.style.top = window.pageYOffset + "px";
                    self.board.style.left = window.pageXOffset + "px";
                    self.board.style.width = window.innerWidth + "px";
                }
            }, false);
        }

        return this;
    };


    /**
     * Hide the keybaord
     * uses removeClass
     * calls the onHide funciton from options
     *
     */
    Keys.prototype.hide = function () {
        this.removeClass('visible');
        //this.board.style.top = "-60px";
        if(this.options.onHide){
            return this.options.onHide();
        }
    };

    /**
     * Show the keybaord
     * uses addClass
     * calls the onShow funciton from options
     *
     */
    Keys.prototype.show = function () {
        var self = this;
        this.addClass('visible');
        self.board.style.top = window.pageYOffset + "px";
        self.board.style.left = window.pageXOffset + "px";
        self.board.style.width = window.innerWidth + "px";
        if(self.options.onShow){
            return self.options.onShow();
        }
    };
        
    /**
     * Create a new Key object
     *
     * 
     * @constructor
     * @param {Object} key the json object defining the key
     * @return {Object} exports for chaining
     */
    var Key = function(key){
        var self = this;
        var button = document.createElement('a');

        button.value = key.value?key.value:key;
        button.innerHTML = key.display?key.display:key;


        button.className = "key";
        
        
        button.addEventListener('touchmove', function(){
            self.justMoved = true;
        });
        button.addEventListener('mousedown', function (event) {
            event.preventDefault();
        }, false);
        button.addEventListener('mouseup', function (event) {
            event.preventDefault();
        }, false);
        
        this.button = button;
        this.behavior = key.behavior;

        return this;
    };


    /**
     * The action to be taken when a button is pressed.
     *
     * Change the prototype to change the behavior of all keys
     * or change just one key's hitButton to change only it's behavior
     * 
     * @param {Element} input the input area to take the key action in.
     *
     */
    Key.prototype.hitButton = function (input) {
        var self = this;
        if(self.justMoved){
            self.justMoved = false;
            return;
        }
        //self.el.removeEventListener('touchend', self.hitButton, false);
        event.preventDefault();
        // console.log(self);
        var button_template = _.template(self.button.value);
        //
        console.log(input);
        Keys.insertAtCaret(input, button_template);

        if(self.behavior){
            self.behavior();
        }

        // if (input.replaceRange) {
        //     var cursor_temp = self.input.getCursor(true);
        //     input.replaceRange(value, cursor_temp);
        // } else {
        //     Keys.insertAtCaret(input, button_template);
        // }

        
    };

    Keys.Key = Key;
        

    /**
     * Test if we are in a mobile browser, currently only checks for 'i' things
     */
    Keys.isMobile = function(){
        return (navigator.userAgent.indexOf('iPhone') != -1) || 
                (navigator.userAgent.indexOf('iPod') != -1) || 
                (navigator.userAgent.indexOf('iPad') != -1);
    }


    /**
     * try and make an AMD module out of this, if we can't return a global
     */
    if ( typeof define === "function" && define.amd) {
        define( "keys", [], function () { return Keys; } );
    } else {
        window.Keys = Keys;
    }

    
})(window);