const express = require('express');

const router = express.Router();

const quranController = require('../../controllers/third-party/quran');


router.get('/quran/surah', quranController.getListOfSurahs);

//http://api.alquran.cloud/v1/surah

router.get('/quran/surah/:surah', quranController.getSurah);


router.get('/quran/surah/:surah/:language', quranController.getSurahTranslation);

module.exports= router;
