const axios = require('axios');

const error = require('../../constants/error');

exports.getListOfSurahs = async ( req, res , next ) => {



    try {
        
        const response = await axios.get('http://api.alquran.cloud/v1/surah');

        if(!response){

            error("Sever faced an error working the list of surah.", 404);
        }
        const data = response.data.data;


        return res.status(200).json({
    
            data: data
        
        });


    }

    catch(error){

        if(!error.statusCode){
            error.statusCode = 500
        }

        next(error);

    }
}




    exports.getSurah = async ( req, res , next ) => {
        const surah = req.params.surah;

        console.log(surah);

        console.log("we made it here");
        
        


        try {
            
            const response = await axios.get(`http://api.alquran.cloud/v1/surah/${surah}`);


    
            if(!response){
    
                return res.status(400).json({
                    message:"bad request",
                    code: 400
                })
            }


    
            const data = response.data.data;
    
            return res.status(200).json({
                
                data: data
            
            });
    
    
        }
    
        catch(error){
    
            if(!error.statusCode){
                error.statusCode = 500
            }
          
            
    
            next(error);
    
        }
    
}



exports.getSurahTranslation = async ( req, res , next ) => {
    const surah = req.params.surah;

    const language = req.params.language;

    console.log(surah);

    console.log("we made it here");
    
    


    try {
        
        const response = await axios.get(`http://api.alquran.cloud/v1/surah/${surah}/${language}`);



        if(!response){

            return res.status(400).json({
                message:"bad request",
                code: 400
            })
        }



        const data = response.data.data;

        return res.status(200).json({
            
            data: data
        
        });


    }

    catch(error){

        if(!error.statusCode){
            error.statusCode = 500
        }
      
        

        next(error);

    }

}


