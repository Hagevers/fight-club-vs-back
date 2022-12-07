const schema = require('../models/UserTemplate');

exports.attackMember = function(member){
    schema.findOne({_id: member._id})
    .select('Power Resources')
    .then(data => {
        console.log(data);
    })
    .catch(err => console.log(err))
    
}