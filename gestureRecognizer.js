// gestureRecognizer
(function(host/*host-object*/, recordMoves/*recordMoves-object*/, undefined) {

    "use strict";
    
    var r = function(sel, func) {
        
        if (!sel)
            return;

        var self = this;
        this.callback = func;

        recordMoves(sel, function(obj) {
            self.recordMovesCallback(obj);
        });
    };
    
    /*var createUUID = R._createUUID = (function (uuidRegEx, uuidReplacer) {
        return function () {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function (c) {
        var r = math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    });
    
    r.prototype.toString = function() {
        
    }
    */
    
    r.prototype.threshold = {
        tolerance : { x : 10, y : 10 },
        value     : { x : 50, y : 50 }
    };
    
    r.prototype.cache = {
        total : { x : 0, y : 0 },
        element: null
    };
    
    host.gestureRecognizer = function(selector, callback) {
        return new r(selector, callback);
    }

})(this, this.recordMoves);