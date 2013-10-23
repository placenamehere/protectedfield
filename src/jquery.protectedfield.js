// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "protectedfield",
        defaults = {
          triggerClass: "pf-trigger",
          lockClass: "glyphicon glyphicon-lock", // bootstrap icon class
          msg: "Are you sure you want to edit this field?",
          triggerEvent: "click"
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            var _this = this,
                $el = $(_this.element),
                $icon = $("<i class='"+ _this.options.triggerClass +" "+ _this.options.lockClass +"' title='edit field?'></i>"),
                $trigger;

            if (!$el.next().is("."+_this.options.triggerClass)) {
              // STEP 1: set protected field to disabled
              $el.attr("disabled","disabled");

              // STEP 2: draw lock icon
              $el.after($icon);
              $trigger = $el.next();

              // STEP 3: attach click events
              $trigger.on(_this.options.triggerEvent,function(e) {
                e.preventDefault();

                if (confirm(_this.options.msg)) {
                  $el.removeAttr("disabled");
                  $trigger.remove();
                }
              });
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );
