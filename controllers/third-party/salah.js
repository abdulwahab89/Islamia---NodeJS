const axios = require('axios');

require('dotenv').config({ path: './locker.env' });

const User = require('../../models/user/user')

exports.getSalahTimings = async (req , res, next) => {

    

    const date= req.params.date;

    const  longitude  = req.query.longitude;

    const  latitude  = req.query.latitude;

    try{
   
        const  response = await axios.get(`${process.env.SALAH_TIMINGS_URL}/${date}?latitude=${latitude}&longitude=${longitude}`)


    if(!response){

        error('Server faced problem fetching the response', 500);
    }

    res.status(200).json({
        response: response.data.data.timings
    });

    }

    catch(error){

        if(!error.statusCode){

            error.statusCode = 500;

        }

        console.log("Something occurred while working", error);
        

        next(error);

    }
}

    
    

function timeToMilliseconds(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours * 3600000) + (minutes * 60000); // Convert hours and minutes to ms
}

exports.upComingSalah = async (req, res, next) => {
    const time = req.params.time; 
    const date = req.params.date; 
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;

    try {

        const response = await axios.get(
            `${process.env.SALAH_TIMINGS_URL}/${date}?latitude=${latitude}&longitude=${longitude}`
        );

        let salahTimings = response.data.data.timings;

        let fiveSalahs = [
            { name: "Fajr", time: salahTimings.Fajr },
            { name: "Dhuhr", time: salahTimings.Dhuhr },
            { name: "Asr", time: salahTimings.Asr },
            { name: "Maghrib", time: salahTimings.Maghrib },
            { name: "Isha", time: salahTimings.Isha }
        ];

        let userTimeMs = timeToMilliseconds(time);

        let upcomingSalah = null;

        for (let i = 0; i < fiveSalahs.length; i++) {
            let salahTimeMs = timeToMilliseconds(fiveSalahs[i].time); 

            if (salahTimeMs > userTimeMs) {
                upcomingSalah = fiveSalahs[i];
                break; 
            }
        }

        if (upcomingSalah) {
            return res.json({ next_salah: upcomingSalah });
        } 
        else {
            return res.json({ next_salah: fiveSalahs[0] }); 
        }
    } 
    catch (error) {
        next(error);
    }
}


// lets work on current salah's user can pray 24 hours from now.....


exports.getCurrentSalahsToPray = async ( req , res , next ) => {

    const date = req.params.date; 

    const longitude = req.query.longitude;

    const latitude = req.query.latitude;

    const userId = req.user.userId;

    const user = await User.findById(userId).populate('goals');

    if( !user ) {
    
        error("No user found", 404);
    
    }
    let userGoal = user.goals.find( goal => goal.category === "salah");

    if(!userGoal) {

        return res.status(404).json({
            message: " User has no active goals"
        });
    }

    let createdAtDate = userGoal.createdAt;

    let nextResetDate = userGoal.nextReset;

    let createdAtMs = createdAtDate.getTime();
    let nextResetMs = nextResetDate.getTime();

    


    try { 

        const response = await axios.get(
            `${process.env.SALAH_TIMINGS_URL}/${date}?latitude=${latitude}&longitude=${longitude}`
        );

        const salahTimings = response.data.data.timings;

        let prayersInRange = [];

        let fiveSalahs = [
            { name: "Fajr", time: salahTimings.Fajr },
            { name: "Dhuhr", time: salahTimings.Dhuhr },
            { name: "Asr", time: salahTimings.Asr },
            { name: "Maghrib", time: salahTimings.Maghrib },
            { name: "Isha", time: salahTimings.Isha }
        ];

        for(let x = 0; x < fiveSalahs.length; x++) {

            if( createdAtMs >= timeToMilliseconds(fiveSalahs[x].time) <= nextResetMs){
                prayersInRange.push(fiveSalahs[x])
            }

        }

        return res.status(200).json({
            date:createdAtDate,
            prayers: prayersInRange,
        })

    }

    catch(error){

        
        next(error);

    }   
    


} 



function timeToMilliseconds(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours * 3600000) + (minutes * 60000); 
}
