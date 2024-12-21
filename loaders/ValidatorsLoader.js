const loader           = require('./_common/fileLoader');
const Pine             = require('qantra-pineapple');

/** 
 * load any file that match the pattern of function file and require them 
 * @return an array of the required functions
*/
module.exports = class ValidatorsLoader {
    constructor({models, customValidators}={}){
        this.models = models;
        this.customValidators = customValidators;
    }
    load(){

        const validators = {};

        /**
         * load schemes
         * load models ( passed to the consturctor )
         * load custom validators
         */
        const schemes = loader('./managers/**/*.schema.js');

        Object.keys(schemes).forEach(sk=>{
            let pine = new Pine({models: this.models, customValidators: this.customValidators});
            validators[sk] = {};
            Object.keys(schemes[sk]).forEach(s=>{
                validators[sk][s] =  async (data)=>{
                    const result = await pine.validate(data, schemes[sk][s])

                    if (typeof result != "boolean") {
                        result.forEach(item => {
                            // console.log(item)
                            if (item.log == "_custom") {
                                item.message = `${item.label} is invalid`;
                            }
                        })
                    }

                    return result;
                }
                /** also exports the trimmer function for the same */
                validators[sk][`${s}Trimmer`] = async (data)=>{
                    return (await pine.trim(data, schemes[sk][s]));
                }
            });
        })

        return validators;
    }
}