const axios = require('axios');

const error = require('../../constants/error')

exports.getHadithSection = async ( req, res , next ) => {

    const sectionNumber = req.params.sectionNumber;
    
    const version = req.params.version;

    try {

        const response = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${version}/sections/${sectionNumber}.json`)

        const data = response.data;

        if(!response){

            error("Failed to fetch the hadith", 404);

        }


        res.status(200).json({
            data: data
        })


    }

    catch(error){

        if(!error.stautsCode)
        next(error);

    }
}

exports.getHadithEditions = async ( req , res , next ) => {

    try {

        const response = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json`)

        const data = response.data;

        if(!response){

            error("Failed to fetch the hadith", 404);

        }


        res.status(200).json({
            data: data
        })


    }

    catch(error){

        if(!error.stautsCode)
        next(error);

    }

    
}