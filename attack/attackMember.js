const schema = require('../models/UserTemplate');

exports.attackMember = function(request, response){
    const {id} = request.params;
    const {attacker} = request.body;
    
    let attackerPower = 0,attackedPower = 0;
    schema.findOne({_id: id})
    .select('Power Resources')
    .then(data => {
        schema.findOne({_id:attacker})
        .select('Power Resources')
        .then(attackDet => {

            attackDet.Power.Items.map(item => attackerPower += item.power);
            attackerPower *= attackDet.Power.Soldiers.Ammount;
            
            data.Power.Items.map(item => attackedPower += item.power);
            attackedPower *= data.Power.Soldiers.Ammount;

            if(attackerPower > attackedPower){
                attackDet.$inc('Resources.Gold', (data.Resources.Gold * 0.3));
                data.$inc('Resources.Gold', -(data.Resources.Gold * 0.3));
            }

        });
        
       
    })
    .catch(err => console.log(err))
    
}