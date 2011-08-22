// gestureRecognizer
(function(host/*host-object*/, onUserInteractionMove/*onUserInteractionMove-object*/, undefined) {

    "use strict";
    
    var r = function(sel, func) {
        
        if (!sel)
            return;

        var self = this;
        this.callback = func;

        onUserInteractionMove(sel, function(obj) {
            // callback function must be overwritten by a derived class
            self.userInteractionMoveCallback(obj);
        });
    };
    
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

})(this, this.onUserInteractionMove);