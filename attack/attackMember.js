const schema = require('../models/UserTemplate');

exports.attackMember = function(request, response){
    const {attacked} = request.params;
    const {attacker} = request.body;
    let AttackerPower,AttackedPower;
    schema.findOne({_id: attacked})
    .select('Power Resources')
    .then(data => {
        schema.findOne({_id:attacker})
        .select('Power')
        .then(attackDet => {
            console.log(attackDet);
            AttackerPower = attackDet.Power.Soldiers.Ammount * attackDet.Power.Items;
        })
        AttackedPower = data.Power.Soldiers.Ammount * data.Power.Items;
        console.log(AttackerPower + " " + AttackedPower);
       
    })
    .catch(err => console.log(err))
    
}