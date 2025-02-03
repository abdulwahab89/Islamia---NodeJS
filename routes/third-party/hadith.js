const express = require('express');

const router = express.Router();

const hadithController = require('../../controllers/third-party/hadith')

router.get('/hadith/section/:version/:sectionNumber', hadithController.getHadithSection);


router.get('/hadith/editions', hadithController.getHadithEditions);


module.exports = router;

