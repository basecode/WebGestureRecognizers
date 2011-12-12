// gestureRecognizer
(function(host/*host-object*/, onUserInteractionMove/*onUserInteractionMove-object*/, undefined) {

    "use strict";

    var r = function(sel, func) {

        if (!sel)
            return;

        var self = this;
        this.callback = func;
        this._attached = true;

        onUserInteractionMove(sel, function(obj) {
            // callback function must be overwritten by a derived class
            if (self._attached === true) {
                console.log("asdasda asdads");
                self.userInteractionMoveCallback(obj);
            }
        });
    };

    var proto = r.prototype;

    proto.threshold = {
        tolerance : { x : 10, y : 10 },
        value     : { x : 50, y : 50 }
    };

    proto.cache = {
        total : { x : 0, y : 0 },
        element: null
    };

    proto.detach = function() {
        this._attached = false;
    };

    proto.attach = function() {
        this._attached = true;
    };

    host.gestureRecognizer = function(selector, callback) {
        return new r(selector, callback);
    }

})(this, this.onUserInteractionMove);
