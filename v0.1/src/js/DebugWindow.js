import $ from 'jquery';
import Messages from '../js/Messages';
import ModalWindow from '../js/ModalWindow';
import MiscUtils from '../js/MiscUtils';

import Index from '../Component/Index';


var DebugWindow = ModalWindow(function () {
  $(debugCancelID).on('click', cancel.bind(this));
  $(debugFormID).on('submit', submit.bind(this));
});


var debugCancelID = '#debugCancel';
var debugFormID = '#debugForm';
var debugOKID = '#debugOK';


DebugWindow.prototype.close = function (actions) {
  actions = actions || [];
  this._emitEvent(Messages.DEBUG_WINDOW_CLOSED, actions);
  this._toggleDisplay();
};


var cancel = function (e) {
  e.preventDefault();
  this.close([]);
};


var submit = function (e) {
  e.preventDefault();

  var actions = [];

  // Get element values
  var shouldAdd = $('.debugAdd:checked').val();
  if (shouldAdd === 'true')
    actions.push({ action: DebugWindow.ADD_FUNDS, data: {} });

  this.close(actions);
};


DebugWindow.prototype.open = function () {
  this._toggleDisplay();
};


var defineAction = (function () {
  var uid = 0;

  return function (name) {
    Object.defineProperty(DebugWindow, name, MiscUtils.makeConstantDescriptor(uid));
    uid += 1;
  };
})();


defineAction('ADD_FUNDS');


export default DebugWindow;

