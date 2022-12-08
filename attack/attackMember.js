const schema = require('../models/UserTemplate');

exports.attackMember = function(request, response){
    const {id} = request.params;
    const {attacker} = request.body;
    
    let AttackerPower,AttackedPower;
    schema.findOne({_id: id})
    .select('Power Resources')
    .then(data => {
        schema.findOne({_id:attacker})
        .select('Power')
        .then(attackDet => {
            AttackerPower = attackDet.Power.Soldiers.Ammount * attackDet.Power.Items[0].power;
            console.log(data);
            AttackedPower = data.Power.Soldiers.Ammount * data.Power.Items[0].power;
            console.log(AttackerPower + " " + AttackedPower);
        });
        
       
    })
    .catch(err => console.log(err))
    
}