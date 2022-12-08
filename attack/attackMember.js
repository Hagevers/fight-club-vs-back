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
            attackDet.Power.Items.map(item => attackerPower += item.power);

            console.log(attackerPower);
            attackerPower *= attackDet.Power.Soldiers.Ammount;
            
            data.Power.Items.map(item => attackedPower += item.power);
            attackedPower *= data.Power.Soldiers.Ammount;

            console.log(attackerPower + " " + attackedPower);
        });
        
       
    })
    .catch(err => console.log(err))
    
}