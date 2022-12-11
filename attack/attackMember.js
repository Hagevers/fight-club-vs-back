const schema = require('../models/UserTemplate');
const report = require('../models/ReportModel');

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
                attackDet.$inc('Resources.Gold', (data.Resources.Gold * 0.3)).save();

                data.$inc('Resources.Marble', -(data.Resources.Marble * 0.3)).save();
                attackDet.$inc('Resources.Marble', (data.Resources.Marble * 0.3)).save();

                data.$inc('Resources.Solfour', -(data.Resources.Solfour * 0.3)).save();
                attackDet.$inc('Resources.Solfour', (data.Resources.Solfour * 0.3)).save();

                data.$inc('Resources.Food', -(data.Resources.Food * 0.3)).save();
                attackDet.$inc('Resources.Food', (data.Resources.Food * 0.3)).save();

                const newReport = new report({
                    Attacker: attackDet.NickName,
                    Defender: data.NickName,
                    HaveWon: true,
                    Gold: attackDet.Resources.Gold + data.Resources.Gold,
                    Marble: attackDet.Resources.Marble + data.Resources.Marble,
                    Solfour: attackDet.Resources.Solfour + data.Resources.Solfour,
                    Food: attackDet.Resources.Food + data.Resources.Food,
                    SoldiersDied: attackDet.Power.Soldiers.Ammount,
                    Alliance: attackDet.alliance

                });
                newReport.save().then(data=> {
                    return response.status(200).send(data)
                });
            }
        });
        
       
    })
    .catch(err => console.log(err))
    
}