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

    r.prototype.checkThresholdToleranceForY = function(deltaY) {
        var top = this.cache.total.y > 0 && deltaY > -this.threshold.tolerance.y;
        var bottom  = this.cache.total.y < 0 && deltaY < this.threshold.tolerance.y;
        return top || bottom;
    }
    
    // userInteractionMoveCallback
    r.prototype.userInteractionMoveCallback = function(obj) {

        this.cache.element = obj.element;

        if (this.checkThresholdToleranceForX(obj.position.delta.x)) {
            this.cache.total.x += obj.position.delta.x;
        } else {
            this.cache.total.x = obj.position.delta.x;
        }
        
        if (this.checkThresholdToleranceForY(obj.position.delta.y)) {
            this.cache.total.y += obj.position.delta.y;
        } else {
            this.cache.total.y = obj.position.delta.y;
        }

        //console.log(this.cache.total.x, recordMovesCallbackObject.isLastAction());
        var _isSwipeLeft = obj.isLastAction() && this.cache.total.x < -this.threshold.value.x;
        var _isSwipeRight = obj.isLastAction() && this.cache.total.x > this.threshold.value.x;

        var _isSwipeTop = obj.isLastAction() && this.cache.total.y > this.threshold.value.y;
        var _isSwipeBottom = obj.isLastAction() && this.cache.total.y < -this.threshold.value.y;

        var callbackObject = {
            isSwipeLeft : function() {
                return _isSwipeLeft;
            },
            isSwipeRight : function() {
                return _isSwipeRight;
            },
            isSwipeTop : function() {
                return _isSwipeTop;
            },
            isSwipeBottom : function() {
                return _isSwipeBottom;
            },
            swipeHorizontalCanceled : function() {
                return obj.isLastAction() && !_isSwipeLeft && !_isSwipeRight;
            },
            swipeVerticalCanceled : function() {
                return obj.isLastAction() && !_isSwipeTop && !_isSwipeBottom;
            },
            delta : obj.position.delta,
            element: this.cache.element
        };
        
        this.callback(callbackObject);
        
        if (obj.isLastAction()) {
            this.cache.total.x = 0;
            this.cache.total.y = 0;
        }
    }
    
    host.swipeGestureRecognizer = function(selector, callback) {
        return new r(selector, callback);
    }

})(this, this.gestureRecognizer);