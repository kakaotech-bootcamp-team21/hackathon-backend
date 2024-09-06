const express = require('express');
const Fairytale = require('../models/fairytale');
const { generateStory, generateImage } = require('../service/aiService');
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
    
    // 몽고디비에서 맨 마지막 storyId를 가져오기 


    try {
        // 요청 데이터 
        const requestData = {
            title,
            ifCondition
        };

        //AI 함수 호출 코드 작성 필요함

        // api 응답 처리 
        const newFairytale = new Fairytale({
            storyId,
            title,
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

        //AI 함수 호출 코드 작성 필요함

        // const storyId=1;
        // const title="hi"
        // const parts=[{"partId":1,"content":"string","imageUrl":"string"}]
        // 사용 예제

        const lastFairytale = await Fairytale.findOne().sort({ storyId: -1 });
        const storyId = lastFairytale ? lastFairytale.storyId + 1 : 1;

        const generatedStoryResult = await generateStory(keyword, message);
        const { paragraphs, endpoints, images} = generatedStoryResult;

        const parts = paragraphs.map((paragraph, index) => ({
            partId: index + 1,
            content: paragraph,
            imageUri: images[index]
        }));


            // .then(result => {
            //     generatedStoryResult = result;
            //     console.log('Generated Story:', result.paragraphs);
            //     console.log('Endpoints:', result.endpoints);
            //     console.log('Generated Images URLs:', result.images);
            // });

        
        // api 응답 처리 
        // const newFairytale = new Fairytale({
        //     storyId: 1,
        //     title: 'title',
        //     parts: [{"partId":"1","content":"string","imageUrl":"string"}]
        // });

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