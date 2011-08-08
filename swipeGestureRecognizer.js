// swipeGestureRecognizer
(function(host/*host-object*/, gestureRecognizer/*gestureRecognizer-object*/, undefined) {

    "use strict";
    
    var DIRECTION_LEFT   = 1;
    var DIRECTION_RIGHT  = 2;
    var DIRECTION_TOP    = 4;
    var DIRECTION_BOTTOM = 8;

    var r = function(sel, func) {
        this.constructor.apply(this, arguments);
    };
    
    r.prototype = new gestureRecognizer();
    
    r.prototype.cons = {
        DIRECTION_LEFT   : DIRECTION_LEFT,
        DIRECTION_RIGHT  : DIRECTION_RIGHT,
        DIRECTION_TOP    : DIRECTION_TOP,
        DIRECTION_BOTTOM : DIRECTION_BOTTOM
    };
    
    r.prototype.checkThresholdToleranceForX = function(deltaX) {
        var left  = this.cache.total.x < 0 && deltaX <  this.threshold.tolerance.x;
        var right = this.cache.total.x > 0 && deltaX > -this.threshold.tolerance.x;
        return left || right;
    }
    
    // recordMovesCallback
    r.prototype.recordMovesCallback = function(recordMovesCallbackObject) {
        
        this.cache.element = recordMovesCallbackObject.element;

        if (this.checkThresholdToleranceForX(recordMovesCallbackObject.delta.x)) {
            this.cache.total.x += recordMovesCallbackObject.delta.x;
        } else {
            this.cache.total.x = recordMovesCallbackObject.delta.x;
        }

        //console.log(this.cache.total.x, recordMovesCallbackObject.isLastRecord());
        var _isSwipeLeft = recordMovesCallbackObject.isLastRecord() && this.cache.total.x < -this.threshold.value.x;
        var _isSwipeRight = recordMovesCallbackObject.isLastRecord() && this.cache.total.x > this.threshold.value.x;

        var callbackObject = {
            isSwipeLeft : function() {
                return _isSwipeLeft;
            },
            isSwipeRight : function() {
                return _isSwipeRight;
            },
            swipeCanceled : function() {
                return recordMovesCallbackObject.isLastRecord() && !_isSwipeLeft && !_isSwipeRight;
            },
            delta : recordMovesCallbackObject.delta,
            element: this.cache.element
        };
        
        this.callback(callbackObject);
        
        if (recordMovesCallbackObject.isLastRecord()) {
            this.cache.total.x = 0;
        }
    }
    
    host.swipeGestureRecognizer = function(selector, callback) {
        return new r(selector, callback);
    }

})(this, this.gestureRecognizer);