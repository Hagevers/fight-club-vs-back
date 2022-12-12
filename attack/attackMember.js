const schema = require('../models/UserTemplate');
const report = require('../models/ReportModel');

exports.attackMember = function(request, response){
    const {id} = request.params;
    const {attacker} = request.body;
    let attackerPower = 0,attackedPower = 0;
    schema.findOne({_id: id})
    .select('Power Resources NickName')
    .then(data => {
        schema.findOne({_id:attacker})
        .select('Power Resources NickName')
        .then(attackDet => {

            attackDet.Power.Items.map(item => attackerPower += item.power);
            attackerPower *= attackDet.Power.Soldiers.Ammount;
            
            data.Power.Items.map(item => attackedPower += item.power);
            attackedPower *= data.Power.Soldiers.Ammount;

            if(attackerPower > attackedPower){
                data.$inc('Resources.Gold', -(data.Resources.Gold * 0.3))
                attackDet.$inc('Resources.Gold', (data.Resources.Gold * 0.3))

                data.$inc('Resources.Marble', -(data.Resources.Marble * 0.3))
                attackDet.$inc('Resources.Marble', (data.Resources.Marble * 0.3))

                data.$inc('Resources.Solfour', -(data.Resources.Solfour * 0.3))
                attackDet.$inc('Resources.Solfour', (data.Resources.Solfour * 0.3))

                data.$inc('Resources.Food', -(data.Resources.Food * 0.3)).save();
                attackDet.$inc('Resources.Food', (data.Resources.Food * 0.3)).save();

                const newReport = new report({
                    Attacker: attackDet.NickName,
                    Defender: data.NickName,
                    Defender_Id: data._id,
                    HaveWon: true,
                    Gold: data.Resources.Gold * 0.3,
                    Marble: data.Resources.Marble * 0.3,
                    Solfour: data.Resources.Solfour * 0.3,
                    Food: data.Resources.Food * 0.3,
                    SoldiersDied: attackDet.Power.Soldiers.Ammount,
                    Alliance: attackDet.alliance
                });
                newReport.save();
                return response.status(200).send(newReport)
            }
        });
    })
    .catch(err => console.log(err))
    
}

exports.getReports = function(request,response){
    const {id} = request.params;
    report.findOne({_id: id}).then(data => {
        return response.status(200).send(data);
    });
}