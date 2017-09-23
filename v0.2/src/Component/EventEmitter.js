var EventEmitter = function (obj) {
    var events = {};
  
  
    var addListener = function (event, listener) {
      if (!(event in events))
        events[event] = [];
  
      var listeners = events[event];
      if (listeners.indexOf(listener) === -1)
        listeners.push(listener);
    };
  
  
    var removeListener = function (event, listener) {
      if (!(event in events))
        events[event] = [];
  
      var listeners = events[event];
      var index = listeners.indexOf(listener);
      if (index !== -1)
        listeners.splice(index, 1);
    };
  
  
    var emitEvent = function (event, value) {
  
      if (!(event in events))
        events[event] = [];
  
      var listeners = events[event];
      for (var i = 0, l = listeners.length; i < l; i++)
        listeners[i](value);
    };
  
  
    var addProps = function (obj, message) {
      var hasExistingProp = ['addEventListener', 'removeEventListener', '_emitEvent'].some(function (prop) {
        return obj[prop] !== undefined;
      });
  
      obj.addEventListener = addListener;
      obj.removeEventListener = removeListener;
      obj._emitEvent = emitEvent;
    };
  
    if (typeof (obj) === 'object')
      addProps(obj, 'object');
    else
      addProps(obj.prototype, 'constructor');
  
    return obj;
  };
  
  
  export default EventEmitter;