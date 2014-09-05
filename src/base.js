var Burner = require('burner');
var Utils = require('drawing-utils-lib');
var Vector = require('vector2d-lib');

/**
 * Creates a new Base.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {boolean} [opt_options.width = 10] Width.
 * @param {boolean} [opt_options.height = 10] Height.
 * @param {boolean} [opt_options.color = 0] Color.
 * @param {boolean} [opt_options.perlin = true] Set to true to move the base via perlin noise.
 * @param {number} [opt_options.perlinSpeed = 0.0001] Perlin speed.
 * @param {number} [opt_options.perlinTime = 100] Initial perlin time.
 * @param {Object} [opt_options.initialLocation = bottom middle of the world] Initial base location.
 * @param {Object} [opt_options.amplitude = world.width / 4, 0] Limit of the base location.
 * @param {number} [opt_options.opacity = 0] Opacity.
 * @param {Object} [opt_base_options.particleOptions=] A map of particleOptions.
 * @param {number} [opt_base_options.particleOptions.width = 0] Particle width.
 * @param {number} [opt_base_options.particleOptions.height = 0] Particle height.
 * @param {number} [opt_base_options.particleOptions.sizeMin = 1] Minimum particle size.
 * @param {number} [opt_base_options.particleOptions.sizeMax = 3] Maximum particle size.
 * @param {number} [opt_base_options.particleOptions.speedMin = 1] Minimum particle speed.
 * @param {number} [opt_base_options.particleOptions.speedMax = 20] Maximum particle speed.
 * @param {number} [opt_base_options.particleOptions.opacityMin = 0.1] Minimum opacity.
 * @param {number} [opt_base_options.particleOptions.opacityMax = 0.2] Maximum opacity.
 * @param {number} [opt_base_options.particleOptions.colorMin = 100] Minimum color. Valid values bw 0 - 255.
 * @param {number} [opt_base_options.particleOptions.colorMax = 200] Maximum color. Valid values bw 0 - 255.
 */
function Base(opt_options) {

  var options = opt_options || {};

  this.width = typeof options.width !== 'undefined' ? options.width : 10;
  this.height = typeof options.height !== 'undefined' ? options.height : 10;
  this.color = typeof options.color !== 'undefined' ? options.color : 0;
  this.perlin = typeof options.perlin !== 'undefined' ? options.perlin : true;
  this.perlinSpeed = options.perlinSpeed || 0.0001;
  this.perlinTime = options.perlinTime || 100;
  this.initialLocation = options.initialLocation || null;
  this.amplitude = options.amplitude || null;
  this.opacity = options.opacity || 0;
  this.particleOptions = options.particleOptions || {};
}

Base.prototype.configure = function(world) {
  this.initialLocation = new Vector(world.width / 2, world.height);
  this.amplitude = new Vector(world.width / 4, 0);
};

/*Base.prototype._baseAfterStep = function() {

  var options = this.particleOptions;

  // use life to throttle particle system
  if ((Burner.System.clock % 3) === 0) {

    var accel = new Vector(1, 1);
    accel.normalize();
    accel.mult(Utils.getRandomNumber(0.01, 0.1, true));
    accel.rotate(Utils.degreesToRadians(Utils.getRandomNumber(150, 300)));

    var width = options.width || 0;
    var height = options.height || 0;

    var sizeMin = typeof options.sizeMin !== 'undefined' ? options.sizeMin : 1;
    var sizeMax = typeof options.sizeMax !== 'undefined' ? options.sizeMax : 3;
    var size = Utils.getRandomNumber(sizeMin, sizeMax, sizeMin || sizeMax);

    var speedMin = typeof options.speedMin !== 'undefined' ? options.speedMin : 1;
    var speedMax = typeof options.speedMax !== 'undefined' ? options.speedMax : 20;
    var maxSpeed = Utils.getRandomNumber(speedMin, speedMax, true);

    var opacityMin = typeof options.opacityMin !== 'undefined' ? options.opacityMin : 0.1;
    var opacityMax = typeof options.opacityMax !== 'undefined' ? options.opacityMax : 0.2;
    var opacity = Utils.getRandomNumber(opacityMin, opacityMax, true);

    var lifespanMin = typeof options.lifespanMin !== 'undefined' ? options.lifespanMin : 70;
    var lifespanMax = typeof options.lifespanMax !== 'undefined' ? options.lifespanMax : 120;
    var lifespan = Utils.getRandomNumber(lifespanMin, lifespanMax);

    var colorMin = typeof options.colorMin !== 'undefined' ? options.colorMin : 100;
    var colorMax = typeof options.colorMax !== 'undefined' ? options.colorMax : 200;
    var color = Utils.getRandomNumber(colorMin, colorMax);

    Burner.System.add('Particle', {
      location: new Vector(this.location.x, this.location.y),
      acceleration: accel,
      width: width,
      height: height,
      color: [color, color, color],
      borderWidth: 0,
      boxShadowBlur: size * 10,
      boxShadowSpread: size * 3,
      boxShadowColor: [color, color, color],
      maxSpeed: maxSpeed,
      opacity: opacity,
      lifespan: lifespan
    });
  }
};*/

module.exports = Base;