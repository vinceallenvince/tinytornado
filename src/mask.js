var Vector = require('burner').Vector;

/**
 * Creates a Mask around the tornado's world.
 * @constructor
 */
function Mask() {
  this.color = [20, 20, 20];
  this.isStatic = true;
  this.borderRadius = 0;
  this.borderWidth = 0;
  this.zIndex = 100;
}

/**
 * Configures an instance of Mask.
 * @param {Object} props A map of required properties.
 * @param {Object} props.location The mask location.
 * @param {number} props.width Width.
 * @param {number} props.height Height.
 * @memberOf Mask
 */
Mask.prototype.configure = function(props) {
  this.location = props.location;
  this.width = props.width;
  this.height = props.height;
};

module.exports = Mask;
