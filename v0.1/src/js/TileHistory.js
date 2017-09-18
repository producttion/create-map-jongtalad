



 export default function TileHistory() {
    this.clear();
  }


  var toKey = function(x, y) {
    return [x, y].join(',');
  };


  TileHistory.prototype.clear = function() {
    this.data = {};
  };


  TileHistory.prototype.getTile = function(x, y) {
    var key = toKey(x, y);
    return this.data[key];
  };


  TileHistory.prototype.setTile = function(x, y, value) {
    var key = toKey(x, y);
    this.data[key] = value;
  };


  // return TileHistory;
