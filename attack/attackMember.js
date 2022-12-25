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
                data.$inc('Resources.Gold', -Math.ceil((data.Resources.Gold * 0.3)))
                attackDet.$inc('Resources.Gold', Math.ceil((data.Resources.Gold * 0.3)))

                data.$inc('Resources.Marble', -Math.ceil((data.Resources.Marble * 0.3)))
                attackDet.$inc('Resources.Marble', Math.ceil((data.Resources.Marble * 0.3)))

                data.$inc('Resources.Solfour', -Math.ceil((data.Resources.Solfour * 0.3)))
                attackDet.$inc('Resources.Solfour', Math.ceil((data.Resources.Solfour * 0.3)))

                data.$inc('Resources.Food', -Math.ceil((data.Resources.Food * 0.3))).save();
                attackDet.$inc('Resources.Food', Math.ceil((data.Resources.Food * 0.3))).save();

                const newReport = new report({
                    Attacker: attackDet.NickName,
                    Defender: data.NickName,
                    Defender_Id: data._id,
                    HaveWon: true,
                    Gold: Math.ceil(data.Resources.Gold * 0.3),
                    Marble: Math.ceil(data.Resources.Marble * 0.3),
                    Solfour: Math.ceil(data.Resources.Solfour * 0.3),
                    Food: Math.ceil(data.Resources.Food * 0.3),
                    SoldiersDied: attackDet.Power.Soldiers.Ammount,
                    Alliance: attackDet.alliance
                });
                newReport.save();
                return response.status(200).send(newReport)
            }else{
                const newReport = new report({
                    Attacker: attackDet.NickName,
                    Defender: data.NickName,
                    Defender_Id: data._id,
                    HaveWon: false,
                    Gold: 0,
                    Marble: 0,
                    Solfour: 0,
                    Food: 0,
                    SoldiersDied: 0,
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

exports.buyItem = function(request, response){
    const {id, item} = request.body;
    schema.findOneAndUpdate({_id: id}).then(data => {
        console.log(data.Power.Items);
        console.log(item.name, item.power);
        data.Power.Items.push({name: item.name, power: item.power})
        return response.status(200)
    })
    
}