import Messages from '../js/Messages';
import MiscUtils from '../js/MiscUtils';
import Tile from '../js/Tile';
import TileUtils from '../js/TileUtils';
import WorldEffects from '../js/WorldEffects';



var init = function (cost, map, shouldAutoBulldoze, isDraggable) {
  isDraggable = isDraggable || false;
  Object.defineProperty(this, 'toolCost', MiscUtils.makeConstantDescriptor(cost));
  this.result = null;
  this.isDraggable = isDraggable;
  this._shouldAutoBulldoze = shouldAutoBulldoze;
  this._map = map;
  this._worldEffects = new WorldEffects(map);
  this._applicationCost = 0;
};


var clear = function () {
  this._applicationCost = 0;
  this._worldEffects.clear();
};


var addCost = function (cost) {
  this._applicationCost += cost;
};


var doAutoBulldoze = function (x, y) {
  var tile = this._worldEffects.getTile(x, y);
  if (tile.isBulldozable()) {
    tile = TileUtils.normalizeRoad(tile);
    if ((tile >= Tile.TINYEXP && tile <= Tile.LASTTINYEXP) ||
      (tile < Tile.HBRIDGE && tile !== Tile.DIRT)) {
      this.addCost(1);
      this._worldEffects.setTile(x, y, Tile.DIRT);
    }
  }
};


var apply = function (budget) {
  this._worldEffects.apply();
  budget.spend(this._applicationCost);
  this.clear();
};


var modifyIfEnoughFunding = function (budget) {
  if (this.result !== this.TOOLRESULT_OK) {
    this.clear();
    return false;
  }

  if (budget.totalFunds < this._applicationCost) {
    this.result = this.TOOLRESULT_NO_MONEY;
    this.clear();
    return false;
  }

  apply.call(this, budget);
  this.clear();
  return true;
};


var TOOLRESULT_OK = 0;
var TOOLRESULT_FAILED = 1;
var TOOLRESULT_NO_MONEY = 2;
var TOOLRESULT_NEEDS_BULLDOZE = 3;

var BaseTools = {
  addCost: addCost,
  autoBulldoze: true,
  bulldozerCost: 1,
  clear: clear,
  doAutoBulldoze: doAutoBulldoze,
  init: init,
  modifyIfEnoughFunding: modifyIfEnoughFunding,
  TOOLRESULT_OK: TOOLRESULT_OK,
  TOOLRESULT_FAILED: TOOLRESULT_FAILED,
  TOOLRESULT_NO_MONEY: TOOLRESULT_NO_MONEY,
  TOOLRESULT_NEEDS_BULLDOZE: TOOLRESULT_NEEDS_BULLDOZE
};


var save = function (saveData) {
  saveData.autoBulldoze = BaseTools.autoBulldoze;
};


var load = function (saveData) {
  BaseTools.autoBulldoze = saveData.autoBulldoze;
};


var makeTool = function (toolConstructor) {
  toolConstructor.prototype = Object.create(BaseTools);
  return toolConstructor;
};


var BaseTool = {
  makeTool: makeTool,
  setAutoBulldoze: function (value) {
    BaseTools.autoBulldoze = value;
  },
  getAutoBulldoze: function () {
    return BaseTools.autoBulldoze;
  },
  save: save,
  load: load
};

export default BaseTool;

