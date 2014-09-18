var Burner = require('burner');
var Utils = require('burner').Utils;
var Vector = require('burner').Vector;

/**
 * Creates a new Base.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {boolean} [opt_options.width = 10] Width.
 * @param {boolean} [opt_options.height = 10] Height.
 * @param {boolean} [opt_options.color = 0] Color.
 * @param {boolean} [opt_options.perlin = true] Set to true to move the base via perlin noise.
 * @param {number} [opt_options.perlinSpeed = 0.0001] Perlin speed.
 * @param {number} [opt_options.perlinTime = 100] Initial perlin time.
 * @param {Object} [opt_options.initialLocation = null] Initial base location.
 * @param {Object} [opt_options.amplitude = null] Limit of the base location.
 * @param {number} [opt_options.opacity = 0] Opacity.
 * @constructor
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
}

/**
 * Configures an instance.
 * @param  {Object} world A world.
 * @memberOf Base
 */
Base.prototype.configure = function(world) {
  this.initialLocation = new Vector(world.width / 2, world.height);
  this.amplitude = new Vector(world.width / 4, 0);
};

module.exports = Base;
