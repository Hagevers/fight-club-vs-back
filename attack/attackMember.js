const schema = require('../models/UserTemplate');

exports.attackMember = function(request, response){
    const {id} = request.params;
    const {attacker} = request.body;
    let resources = {};
    let attackerPower = 0,attackedPower = 0;
    schema.findOne({_id: id})
    .select('Power Resources')
    .then(data => {
        schema.findOne({_id:attacker})
        .select('Power Resources NickName')
        .then(attackDet => {

            attackDet.Power.Items.map(item => attackerPower += item.power);
            attackerPower *= attackDet.Power.Soldiers.Ammount;
            
            data.Power.Items.map(item => attackedPower += item.power);
            attackedPower *= data.Power.Soldiers.Ammount;

            if(attackerPower > attackedPower){
                data.$inc('Resources.Gold', -(data.Resources.Gold * 0.3)).save();
                resources['Gold'] = attackDet.$inc('Resources.Gold', (data.Resources.Gold * 0.3)).save();
                resources['NickName'] = attackDet.NickName;
                resources['Alliance'] = attackDet.alliance;
            }
            response.status(200).send(resources)
        });
        
       
    })
    .catch(err => console.log(err))
    
}