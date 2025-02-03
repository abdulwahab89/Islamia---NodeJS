const express = require('express');

const router = express.Router();

const salahController = require('../../controllers/third-party/salah')

const {isAuth} = require('../../middlewares/isAuthenticated');



router.get('/salah/timings/:date', salahController.getSalahTimings);



router.get('/salah/timings/:date/:time', salahController.upComingSalah);

router.get('/salah/today/prayers/:date', isAuth , salahController.getCurrentSalahsToPray);



module.exports = router;