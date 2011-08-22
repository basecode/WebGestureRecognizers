// onUserInteractionMove
// author : Tobias Reiss
// twitter: @basecode
//
// (void) onUserInteractionMove(selector || element || nodelist, callback-function);
//
// recognize mouse or touch movements and sends some useful information
// to the callback function. 
//
// btw: interactions that are not covered are resize and rotate

/* usage:

onUserInteractionMove("canvas", function callback(callbackObject) {
    
    console.log(callbackObject.element);  //<dom-element>
    console.log(callbackObject.event);    //<event-object>
    
    console.log(callbackObject.position.page); //<absolute x,y>
    console.log(callbackObject.position.element); //<relative x,y>
    console.log(callbackObject.position.delta); //<delta x,y>
    
    if (callbackObject.isFirstAction()) {
        //...
    }
    
    if (callbackObject.isLastAction()) {
        //...
    }
});

*/


(function(host/*host-object*/, doc/*document-object*/) {

    "use strict";
    
    if (!doc)
        return;

    var INVALID_SESSION = 1;
    var VALID_SESSION   = 2;
    var FIRST_ACTION    = 4;
    var LAST_ACTION     = 8;
    
    var supportsTouch = 'createTouch' in doc;

    var m = function(sel, func) {
        this.callback = func;
        this.info = INVALID_SESSION;
        this.attachEventListeners(sel);
    };
    
    m.prototype.getType = function(value) {
        return Object.prototype.toString.apply(value).slice(8, -1).toLowerCase();
    }
    
    m.prototype.cache = {
        x : 0,
        y : 0,
        el: null
    };
    
    m.prototype.userPositionInPage = function(event) {
        return {
            x : (event.touches) ? event.changedTouches[0].pageX : event.pageX,
            y : (event.touches) ? event.changedTouches[0].pageY : event.pageY
        };
    }
    
    m.prototype.userPositionInElement = function(inPagePosition) {
        var obj = this.cache.element, left = 0, top = 0;
        
        do {
            left += obj.offsetLeft;
			top += obj.offsetTop;
        } while(obj = obj.offsetParent);
        
        return {
            x : inPagePosition.x - left,
            y : inPagePosition.y - top
        };
    }

    m.prototype.validateSession = function(e) {
        
        if (/touchstart|mousedown/.test(e.type)) { /* start session */
            this.firstAction(e);
        } else {
            if (this.info & FIRST_ACTION) {
                this.info &= ~FIRST_ACTION;
            }
        }

        if (!(this.info & VALID_SESSION)) {
            // session is invalid
            return false;
        }

        if (/touchend|touchcancel|mouseup/.test(e.type)) { /* end session */
            this.lastAction();
        }

        return this.info & VALID_SESSION;
    }
    
    m.prototype.exit = function() {
        this.info = (this.info | INVALID_SESSION) & ~VALID_SESSION;
    }
    
    m.prototype.moving = function(e) {
        
        if (!this.validateSession(e) && !(this.info & LAST_ACTION)) {
            return;
        }

        var m = this;
        var inPagePosition = this.userPositionInPage(e);
        var inElementPosition = this.userPositionInElement(inPagePosition);
        
        // diff to the last position
        var delta = {
            x : inPagePosition.x - this.cache.x,
            y : inPagePosition.y - this.cache.y
        }

        // cache values
        this.cache.x = inPagePosition.x;
        this.cache.y = inPagePosition.y;

        // call callback
        // delta will be 0 on last action
        this.callback({
            element : this.cache.element,
            position : {
                page : inPagePosition,
                element : inElementPosition,
                delta : delta
            },
            isFirstAction : function() {
                return !!(m.info & FIRST_ACTION);
            },
            isLastAction : function() {
                return !!(m.info & LAST_ACTION);
            },
            event : e
        });
        
        // remove flag LAST_ACTION
        this.info &= ~LAST_ACTION;
    }
    
    m.prototype.firstAction = function(e) {
        var pagePosition = this.userPositionInPage(e);
        this.cache.x = pagePosition.x;
        this.cache.y = pagePosition.y;
        
        if (this.getType(e.target.offsetParent) == "undefined") {
            throw new Error("DOM Element 'offsetParent' is not supported.");
        }
        
        this.cache.element = e.target;
        
        this.info = (this.info | VALID_SESSION | FIRST_ACTION) & ~INVALID_SESSION;
    }
    
    m.prototype.lastAction = function() {
        this.info = (this.info | INVALID_SESSION | LAST_ACTION) & ~VALID_SESSION;
    }
    
    m.prototype.attachEventListeners = function(sel) {
        var selType = this.getType(sel);
        var eve = "addEventListener";
        var els = selType == "string" ? doc["querySelectorAll"](sel)/*selector*/ : /element$/.test(selType) ? [sel]/*html-element*/ : sel/*nodelist*/;
        var m   = this;
        var action = function(e) {
            e.preventDefault();
            m.moving(e);
        }
        
        if (!els || !(eve in host))
            return;
        
        for (var i = 0, len = els.length; i < len; i++) {
            els[i][eve](supportsTouch ? "touchstart" : "mousedown", action, false);
        }

        host[eve](supportsTouch ? "touchmove" : "mousemove", action, false);
        host[eve](supportsTouch ? "touchend" : "mouseup", action, false);
        host[eve](supportsTouch ? "touchcancel" : "mouseup", action, false);
        
        return this;
    }

    host.onUserInteractionMove = function(selector, callback) {
        return new m(selector, callback);
    }

})(this, this.document);