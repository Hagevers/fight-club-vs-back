const schema = require('../models/UserTemplate');

exports.attackMember = function(request, response){
    const {id} = request.params;
    schema.findOne({_id: id})
    .select('Power Resources')
    .then(data => {
        console.log(data);
    })
    .catch(err => console.log(err))
    
}