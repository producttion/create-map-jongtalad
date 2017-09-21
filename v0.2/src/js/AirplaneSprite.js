import SpriteConstants from '../js/SpriteConstants';
import SpriteUtils from '../js/SpriteUtils';
import BaseSprite from '../js/BaseSprite';
import Random from '../js/Random';
import Messages from '../js/Messages';
import MiscUtils from '../js/MiscUtils';




export default function AirplaneSprite(map, spriteManager, x, y) {
  this.init(SpriteConstants.SPRITE_AIRPLANE, map, spriteManager, x, y);
  this.width = 48;
  this.height = 48;
  this.xOffset = -24;
  this.yOffset = -24;
  if (x > SpriteUtils.worldToPix(map.width - 20)) {
    this.destX = this.x - 200;
    this.frame = 7;
  } else {
    this.destX = this.x + 200;
    this.frame = 11;
  }
  this.destY = this.y;
}


BaseSprite(AirplaneSprite);


var xDelta = [0, 0, 6, 8, 6, 0, -6, -8, -6, 8, 8, 8];
var yDelta = [0, -8, -6, 0, 6, 8, 6, 0, -6, 0, 0, 0];

AirplaneSprite.prototype.move = function (spriteCycle, disasterManager, blockMaps) {
  var frame = this.frame;

  if ((spriteCycle % 5) === 0) {
    // Frames > 8 mean the plane is taking off
    if (frame > 8) {
      frame--;
      if (frame < 9) {
        // Planes always take off to the east
        frame = 3;
      }
      this.frame = frame;
    } else {
      var d = SpriteUtils.getDir(this.x, this.y, this.destX, this.destY);
      frame = SpriteUtils.turnTo(frame, d);
      this.frame = frame;
    }
  }

  var absDist = SpriteUtils.absoluteDistance(this.x, this.y, this.destX, this.destY);
  if (absDist < 50) {
    // We're pretty close to the destination
    this.destX = Random.getRandom(SpriteUtils.worldToPix(this.map.width)) + 8;
    this.destY = Random.getRandom(SpriteUtils.worldToPix(this.map.height)) + 8;
  }

  if (disasterManager.enableDisasters) {
    var explode = false;

    var spriteList = this.spriteManager.getSpriteList();
    for (var i = 0; i < spriteList.length; i++) {
      var s = spriteList[i];

      if (s.frame === 0 || s === this)
        continue;

      if ((s.type === SpriteConstants.SPRITE_HELICOPTER ||
        s.type === SpriteConstants.SPRITE_AIRPLANE) &&
        SpriteUtils.checkSpriteCollision(this, s)) {
        s.explodeSprite();
        explode = true;
      }
    }

    if (explode)
      this.explodeSprite();
  }

  this.x += xDelta[frame];
  this.y += yDelta[frame];

  if (this.spriteNotInBounds())
    this.frame = 0;
};


AirplaneSprite.prototype.explodeSprite = function () {
  this.frame = 0;
  this.spriteManager.makeExplosionAt(this.x, this.y);
  this._emitEvent(Messages.PLANE_CRASHED, { showable: true, x: this.worldX, y: this.worldY });
};


// Metadata for image loading
Object.defineProperties(AirplaneSprite,
  {
    ID: MiscUtils.makeConstantDescriptor(3),
    width: MiscUtils.makeConstantDescriptor(48),
    frames: MiscUtils.makeConstantDescriptor(11)
  });


// return AirplaneSprite;

