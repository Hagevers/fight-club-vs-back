const schema = require('../models/UserTemplate');

exports.attackMember = function(request, response){
    const {id} = request.params;
    const {attacker} = request.body;
    
    let attackerPower,attackedPower;
    schema.findOne({_id: id})
    .select('Power Resources')
    .then(data => {
        schema.findOne({_id:attacker})
        .select('Power')
        .then(attackDet => {
            attackDet.Power.Items.forEach(item => attackerPower += item);
            attackerPower *= attackDet.Power.Soldiers.Ammount;
            
            data.Power.Items.forEach(item => attackedPower += item);
            attackedPower *= data.Power.Soldiers.Ammount;
            
            console.log(AttackerPower + " " + AttackedPower);
        });
        
       
    })
    .catch(err => console.log(err))
    
}