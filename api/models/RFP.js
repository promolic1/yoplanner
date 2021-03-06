/**
* RFP.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        fechaInicial:"date",
        fechaFinal:"date",
        configuracionHabitaciones:{
            collection: 'habitacion',
            via: 'rfp'
        },
        salones:{
            collection: 'salon',
            via: 'rfp'
        },
        recintos:{
            collection: 'recinto',
            via: 'rfps'
        }

    },
    beforeCreate : function(rfp,next){
        for(var i in rfp.recintos){
            var recinto = rfp.recintos[i];
            Recinto.findOrCreate({"id":recinto.id},recinto).exec(function(err,data){
                console.log(">>>>> created recinto");
                console.log(err);
                console.log(data);
            }); 
        }
        next();
        
    },
    afterCreate : function(rfp,next){
        var options = {};
        options.subject = "RFP Recibida ✔";
        options.text = JSON.stringify(rfp);
        EmailService.sendEmail(options);
        next();

    }
};

