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

    var proto = r.prototype = new gestureRecognizer();

    proto.cons = {
        DIRECTION_LEFT   : DIRECTION_LEFT,
        DIRECTION_RIGHT  : DIRECTION_RIGHT,
        DIRECTION_TOP    : DIRECTION_TOP,
        DIRECTION_BOTTOM : DIRECTION_BOTTOM
    };

    proto.checkThresholdToleranceForX = function(cachedTotalX, deltaX) {
        var thresholdToleranceX = this.threshold.tolerance.x;
        return (cachedTotalX < 0 && deltaX <  thresholdToleranceX) ||
               (cachedTotalX > 0 && deltaX > -thresholdToleranceX);
    }

    proto.checkThresholdToleranceForY = function(cachedTotalY, deltaY) {
        var thresholdToleranceY = this.threshold.tolerance.y;
        return (cachedTotalY > 0 && deltaY > -thresholdToleranceY) ||
               (cachedTotalY < 0 && deltaY < thresholdToleranceY);
    }

    // userInteractionMoveCallback
    proto.userInteractionMoveCallback = function(obj) {

        var cachedElement = this.cache.element = obj.element;
        var cachedTotal = this.cache.total;
        var objPositionDelta = obj.position.delta;
        var objPositionDeltaX = objPositionDelta.x;
        var objPositionDeltaY = objPositionDelta.y;
        var objIsLastAction = obj.isLastAction();
        var thresholdValue = this.threshold.value;
        var thresholdValueX = thresholdValue.x;
        var thresholdValueY = thresholdValue.y;

        if (this.checkThresholdToleranceForX(cachedTotal.x, objPositionDeltaX)) {
            cachedTotal.x += objPositionDeltaX;
        } else {
            cachedTotal.x = objPositionDeltaX;
        }

        if (this.checkThresholdToleranceForY(cachedTotal.y, objPositionDeltaY)) {
            cachedTotal.y += objPositionDeltaY;
        } else {
            cachedTotal.y = objPositionDeltaY;
        }

        //console.log(this.cache.total.x, recordMovesCallbackObject.isLastAction());
        var _isSwipeLeft = objIsLastAction && cachedTotal.x < -thresholdValueX;
        var _isSwipeRight = objIsLastAction && cachedTotal.x > thresholdValueX;

        var _isSwipeTop = objIsLastAction && cachedTotal.y > thresholdValueY;
        var _isSwipeBottom = objIsLastAction && cachedTotal.y < -thresholdValueY;

        var callbackObject = {
            isSwipeLeft : function() {
                return _isSwipeLeft;
            },
            isSwipeRight : function() {
                return _isSwipeRight;
            },
            isSwipeTop : function() {
                return _isSwipeTop;
            },
            isSwipeBottom : function() {
                return _isSwipeBottom;
            },
            swipeHorizontalCanceled : function() {
                return objIsLastAction && !_isSwipeLeft && !_isSwipeRight;
            },
            swipeVerticalCanceled : function() {
                return objIsLastAction && !_isSwipeTop && !_isSwipeBottom;
            },
            delta : objPositionDelta,
            element: cachedElement
        };

        this.callback(callbackObject);

        if (obj.isLastAction()) {
            cachedTotal.x = 0;
            cachedTotal.y = 0;
        }
    }

    host.onSwipeGesture = function(selector, callback) {
        return new r(selector, callback);
    }

})(this, this.gestureRecognizer);
