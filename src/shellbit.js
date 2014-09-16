/**
 * Creates a new Shell.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.minScale = 0.3] Minium width of the shell base.
 * @param {number} [opt_options.opacity = 0] shell opacity.
 * @param {number} [opt_options.blur = 350] shell blur. Recommended values bw 300 - 400.
 * @param {number} [opt_options.spread = 250] shell spread. Recommended values bw 200 - 300.
 * @param {string} [opt_options.easing = 'easeInExpo'] An easing function to determine shell shape along the spine. See Easing docs for possible values.
 * @param {number} [opt_options.colorMin = 50] Minimum color. Valid values bw 0 - 255.
 * @param {number} [opt_options.colorMax = 255] Maximum color. Valid values bw 0 - 255.
 * @constructor
 */
function Shell(opt_options) {

  var options = opt_options || {};

  this.minScale = typeof options.minScale !== 'undefined' ? options.minScale : 0.1;
  this.maxScale = typeof options.maxScale !== 'undefined' ? options.maxScale : 8;
  this.opacity = typeof options.opacity !== 'undefined' ? options.opacity : 0.75;
  this.blur = typeof options.blur !== 'undefined' ? options.blur : 30;
  this.easing = options.easing || 'easeInExpo';
  this.colorMin = typeof options.colorMin !== 'undefined' ? options.colorMin : 100;
  this.colorMax = typeof options.colorMax !== 'undefined' ? options.colorMax : 255;
}

module.exports = Shell;
