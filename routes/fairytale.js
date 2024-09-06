const express = require('express');
const axios = require('axios');

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

        // const response = await axios.post("", requestData, {
            
        // });

        // api 응답 처리 확인
        res.json(response.data);

        // mongo db에 글 넣고, s3에 받아온 이미지 넣음
        // 코드 작성 예정 

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

        const response = await axios.post("", requestData, {
            
        });

        // api 응답 처리 확인
        res.json(response.data);

        // mongo db에 글 넣고, s3에 받아온 이미지 넣음
        // 코드 작성 예정 

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: 'Server error'});
    }
});


module.exports = router;
