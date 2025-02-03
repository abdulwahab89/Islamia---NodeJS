const { check } = require('express-validator');

let MYCATEGORIES = Object.freeze({
    SALAH: 'Salah',
    HADITH: 'Hadith',
    QURAN : 'Quran',
})

let FREQUENCIES = Object.freeze({
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY : 'monthly',
})
const validateGoal = [

    check('category').notEmpty().withMessage('Category field is empty').isString().withMessage('Category must be a string!').custom( (category) => {
        
        const lowercaseCategory = category? category.toLowerCase() : category

        console.log(lowercaseCategory);
        
        const categories = Object.values(MYCATEGORIES).map(c => c.trim().toLowerCase());
        
        if(!categories.includes(lowercaseCategory)){
return Promise.reject(new Error(`Invalid category, Allowed categories are: ${categories.join(', ')}`));
        }
        return true;
    }),
    check('targetCount').notEmpty().withMessage('TargetCount field cannot be empty').isInt(
        {
            min:1
        }
    ).withMessage('targetCount must be a int and atleast greater zero'),


    check('frequency').custom((frequency) => {

        const frequencies = Object.values(FREQUENCIES).map(c => c.trim().toLowerCase());
     
        const lowercaseFrequency = frequency?  frequency.toLowerCase() : frequency





        if(!frequencies.includes(lowercaseFrequency)){
            return Promise.reject(new Error(`Invalid frequency, Allowed frequencies are: ${frequencies.join(', ')}`));
                    }
                    return true;
                }),
        


]

module.exports = { validateGoal };