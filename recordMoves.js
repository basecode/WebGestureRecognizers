// record moves
(function(host/*host-object*/, doc/*document-object*/, undefined) {

    "use strict";
    
    if (!doc)
        return;

    var INVALID_SESSION = 1;
    var VALID_SESSION   = 2;
    var FIRST_RECORD    = 4;
    var LAST_RECORD     = 8;

    var m = function(sel, func) {
        this.callback = func;
        this.info = INVALID_SESSION;
        this.attachEventListeners(sel);
    };
    
    m.prototype.cons = {
        INVALID_SESSION : INVALID_SESSION,
        VALID_SESSION : VALID_SESSION,
        FIRST_RECORD : FIRST_RECORD,
        LAST_RECORD : LAST_RECORD
    };
    
    m.prototype.cache = {
        x : 0,
        y : 0,
        el: null
    };
    
    m.prototype.getUserPosition = function(event) {
        return {
            x : (event.touches) ? event.changedTouches[0].pageX : event.clientX,
            y : (event.touches) ? event.changedTouches[0].pageY : event.clientY
        };
    }

    m.prototype.validateSession = function(e) {
        if (/touchstart|mousedown/.test(e.type)) { /* start session */
            this.cache.x = this.getUserPosition(e).x;
            this.cache.y = this.getUserPosition(e).y;
            this.cache.element = e.target;
            this.info = (this.info | VALID_SESSION | FIRST_RECORD) & ~INVALID_SESSION;
        } else {
            if (this.info & VALID_SESSION && this.info & FIRST_RECORD) { /*bitwise solution? */
                this.info &= ~FIRST_RECORD;
            }
        }
        
        if (/touchend|touchcancel|mouseup/.test(e.type)) { /* end session */
            this.info = (this.info | INVALID_SESSION | LAST_RECORD) & ~VALID_SESSION;
        }

        return this.info & VALID_SESSION;
    }
    
    m.prototype.exit = function() {
        this.info = (this.info | INVALID_SESSION) & ~VALID_SESSION;
    }
    
    m.prototype.moving = function(e) {
        
        if (!this.validateSession(e) && !(this.info & LAST_RECORD)) {
            return;
        }

        var m = this;
        
        // diff to the last position
        var delta = {
            x : this.getUserPosition(e).x - this.cache.x,
            y : this.getUserPosition(e).y - this.cache.y
        }

        // cache values
        this.cache.x = this.getUserPosition(e).x;
        this.cache.y = this.getUserPosition(e).y;

        // call callback
        // delta will be 0 on last record
        this.callback({
            element : this.cache.element,
            delta   : delta,
            isFirstRecord : function() {
                return !!(m.info & FIRST_RECORD);
            },
            isLastRecord : function() {
                return !!(m.info & LAST_RECORD);
            },
            event : e
        });
        
        // remove flag LAST_RECORD
        this.info &= ~LAST_RECORD;
    }
    
    m.prototype.attachEventListeners = function(sel) {
        var eve = "addEventListener";
        var els = doc.querySelectorAll(sel);
        var m   = this;
        var callback = function(e) {
            e.preventDefault();
            m.moving(e);
        }
        
        if (!els || !(eve in host))
            return;
        
        for (var i = 0, len = els.length; i < len; i++) {
            els[i][eve]("ontouchstart" in host ? "touchstart" : "mousedown", callback, false);
        }

        host[eve]("ontouchmove" in host ? "touchmove" : "mousemove", callback, false);
        host[eve]("ontouchend" in host ? "touchend" : "mouseup", callback, false);
        host[eve]("ontouchcancel" in host ? "touchcancel" : "mouseup", callback, false);
        
        return this;
    }

    host.recordMoves = function(selector, callback) {
        return new m(selector, callback);
    }

})(this, this.document);