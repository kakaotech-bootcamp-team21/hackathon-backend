const express = require('express');
const Fairytale = require('../models/fairytale');

const router = express.Router();

router.post('/origin', async (req,res) =>{
    const { title, ifCondition } = req.body;
    // MongoDB에 사용자 데이터 저장일단 안하고 ai쪽으로 보냄

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
    const { title, keyword, message } = req.body;

    try {
        // 요청 데이터 
        const requestData = {
            title,
            keyword,
            message
        };

        //AI 함수 호출 코드 작성 필요함

        const storyId=1;
        const title="hi"
        const parts=[{"partId":1,"content":"string","imageUrl":"string"}]


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


module.exports = router;
