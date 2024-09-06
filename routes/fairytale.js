const express = require('express');
const Fairytale = require('../models/fairytale');
const { generateStory, generateImage } = require('../service/aicreation');
const { generateStoryOrigin, generateImageOrigin } = require('../service/aiorigin');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/entire', async (req,res) =>{
    try{
        const fairytales = await Fairytale.find();
        res.status(200).json(fairytales);
    } catch (error) {
        console.error("API Error: ", error);
        res.status(500).json({ message: 'server error'});
    }
});

router.post('/origin', async (req,res) =>{
    const { title, ifCondition } = req.body;

    try {
        // 요청 데이터 
        const requestData = {
            title,
            ifCondition
        };
        
        console.log(requestData.title);
        console.log(requestData.ifCondition);

        const lastFairytale = await Fairytale.findOne().sort({ storyId: -1 });
        
        const storyId = lastFairytale ? lastFairytale.storyId + 1 : 1;
        console.log("storyId?? ", storyId)

        // AI쪽 완료되면 받아서 수정하기 
        const generatedStoryResult = await generateStoryOrigin(title, ifCondition);
        console.log(generatedStoryResult)
        const { paragraphs, endpoints, images} = generatedStoryResult;

        const parts = paragraphs.map((paragraph, index) => ({
            partId: index + 1,
            content: paragraph,
            imageUri: images[index]
        }));

        const newFairytale = new Fairytale({
            storyId,
            parts
        });
        
        await newFairytale.save();
        res.status(201).json(newFairytale);

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: 'Server error'});
    }
});

router.post('/creation', async (req,res) =>{
    const { keyword, message } = req.body;

    try {
        // 요청 데이터 
        const requestData = {
            keyword,
            message
        };

        console.log(requestData.keyword);
        console.log(requestData.message);

        const lastFairytale = await Fairytale.findOne().sort({ storyId: -1 });
        
        const storyId = lastFairytale ? lastFairytale.storyId + 1 : 1;
        console.log("storyId??", storyId)

        const generatedStoryResult = await generateStory(keyword, message);
        console.log(generatedStoryResult)
        const { paragraphs, endpoints, images} = generatedStoryResult;

        const parts = paragraphs.map((paragraph, index) => ({
            partId: index + 1,
            content: paragraph,
            imageUri: images[index]
        }));

        const newFairytale = new Fairytale({
            storyId,
            parts
        });

        await newFairytale.save();
        res.status(201).json(newFairytale);

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: 'Server error'});
    }
});


module.exports = router;