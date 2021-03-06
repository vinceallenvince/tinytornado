var ColorPalette = require('colorpalette');
var System = require('burner').System;
var Utils = require('burner').Utils;
var Vector = require('burner').Vector;

/**
 * Creates a new Debris.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.sizeMin = 1] Minimum particle size.
 * @param {number} [opt_options.sizeMax = 3] Maximum particle size.
 * @param {number} [opt_options.speedMin = 1] Minimum particle speed.
 * @param {number} [opt_options.speedMax = 20] Maximum particle speed.
 * @param {number} [opt_options.opacityMin = 0.1] Minimum opacity.
 * @param {number} [opt_options.opacityMax = 0.2] Maximum opacity.
 * @param {number} [opt_options.lifespanMin = 70] Minimum lifespan.
 * @param {number} [opt_options.lifespanMax = 120] Maximum lifespan.
 * @param {number} [opt_options.colorMin = 100] Minimum color. Valid values bw 0 - 255.
 * @param {number} [opt_options.colorMax = 200] Maximum color. Valid values bw 0 - 255.
 * @constructor
 */
function Debris(opt_options) {

  var options = opt_options || {};

  this.sizeMin = typeof options.sizeMin !== 'undefined' ? options.sizeMin : 1;
  this.sizeMax = typeof options.sizeMax !== 'undefined' ? options.sizeMax : 3;
  this.speedMin = typeof options.speedMin !== 'undefined' ? options.speedMin : 1;
  this.speedMax = typeof options.speedMax !== 'undefined' ? options.speedMax : 30;
  this.opacityMin = typeof options.opacityMin !== 'undefined' ? options.opacityMin : 0.1;
  this.opacityMax = typeof options.opacityMax !== 'undefined' ? options.opacityMax : 0.7;
  this.lifespanMin = typeof options.lifespanMin !== 'undefined' ? options.lifespanMin : 70;
  this.lifespanMax = typeof options.lifespanMax !== 'undefined' ? options.lifespanMax : 120;
  this.colorMin = typeof options.colorMin !== 'undefined' ? options.colorMin : 100;
  this.colorMax = typeof options.colorMax !== 'undefined' ? options.colorMax : 200;

  this.width = 0;
  this.height = 0;
  this.lifespan = -1;
  this.startColor = [100, 100, 100]; // TODO: make these options
  this.endColor = [200, 200, 200];
  this.pl = new ColorPalette();
  this.pl.addColor({ // adds a random sampling of colors to palette
    min: 12,
    max: 24,
    startColor: this.startColor,
    endColor: this.endColor
  });

  this.beforeStep = this._beforeStep.bind(this);

}

/**
 * Called before each step function.
 * @private
 * @memberOf Debris
 */
Debris.prototype._beforeStep = function() {

  if ((System.clock % 3) === 0) {

    var accel = new Vector(1, 1);
    accel.normalize();
    accel.mult(Utils.getRandomNumber(0.1, 1, true));
    accel.rotate(Utils.degreesToRadians(Utils.getRandomNumber(140, 310)));
    this.acceleration = accel;

    var size = Utils.getRandomNumber(this.sizeMin, this.sizeMax, this.sizeMin || this.sizeMax);
    var maxSpeed = Utils.getRandomNumber(this.speedMin, this.speedMax, true);
    var opacity = Utils.getRandomNumber(this.opacityMin, this.opacityMax, true);
    var lifespan = Utils.getRandomNumber(this.lifespanMin, this.lifespanMax, true);
    var color = Utils.getRandomNumber(this.colorMin, this.colorMax);

    System.add('Particle', {
      location: new Vector(this.parent.location.x, this.parent.location.y),
      acceleration: accel,
      width: 0,
      height: 0,
      borderWidth: 0,
      boxShadowBlur: size * 10,
      boxShadowSpread: size * 3,
      boxShadowColor: this.pl.getColor(),
      maxSpeed: maxSpeed,
      opacity: opacity,
      lifespan: lifespan
    });
  }
};

/**
 * Configures an instance of Debris.
 * @param {Object} [opt_options=] A map of options.
 * @param {Object} [opt_options.parent = null] The Debris' parent.
 * @memberOf Debris
 */
Debris.prototype.configure = function(opt_options) {
  var options = opt_options || {};
  this.parent = options.parent || null;
};

module.exports = Debris;
