var neoprene = require('neoprene');
var Schema = neoprene.Schema;
neoprene.connect(process.env.NEO4J_URL || require('../../config').host);

var FollowsSchema = new Schema({
  created: { type: Date }
});

module.exports = neoprene.model('relationship', 'Follows', FollowsSchema);