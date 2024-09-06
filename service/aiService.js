const axios = require('axios');
require('dotenv').config();

// OpenAI API 키 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

// 프롬프트 엔지니어링 함수
function generatePrompt(theme, lesson) {
    const prompt = `Create stories that are appropriate for kids ages 3-5. The theme of the story is '${theme}', and it should teach the lesson of '${lesson}'. Make sure the story is simple, fun, and age-appropriate with a positive message. make story's max tokens fix between 200-400.`;
    return prompt;
}

function getParagraphsAndEndpoints(text) {
    // GPT-4o API가 생성한 텍스트에서 문단과 각 문단의 엔드포인트를 추출하는 함수
    const paragraphs = text.split('\n\n');  // 두 줄 바꿈(\n\n)으로 문단을 나눔
    const endpoints = [];
    let startIndex = 0;

    paragraphs.forEach((paragraph) => {
        // 각 문단의 끝 인덱스를 계산하여 저장x
        const endIndex = startIndex + paragraph.length;
        endpoints.push([startIndex, endIndex]);
        // 다음 문단의 시작 인덱스 업데이트
        startIndex = endIndex + 2;  // 두 줄 바꿈 포함
    });

    return { paragraphs, endpoints };
}

// 이미지 생성 함수
async function generateImage(description) {
    try {
        const response = await axios.post(
            `${OPENAI_API_URL}/images/generations`,
            {
                model: 'dall-e-3',
                prompt: description,
                n: 1,
                size: '1024x1024',
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.data[0].url;
    } catch (error) {
        console.error('Error generating image:', error.response ? error.response.data : error.message);
    }
}

// 동화 생성 함수
async function generateStory(theme, lesson) {
    const prompt = generatePrompt(theme, lesson);
    try {
        const response = await axios.post(
            `${OPENAI_API_URL}/chat/completions`,
            {
                model: 'gpt-4',  // OpenAI의 엔진을 선택 (적절한 엔진으로 변경 가능)
                messages: [
                    { role: 'system', content: 'You are an author for children.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const story = response.data.choices[0].message.content;

        // 문단과 엔드포인트 추출
        const { paragraphs, endpoints } = getParagraphsAndEndpoints(story);

        // 각 문단에 대한 이미지 생성
        const images = [];
        for (const paragraph of paragraphs) {
            const imageUrl = await generateImage(paragraph);
            images.push(imageUrl);
        }

        return { paragraphs, endpoints, images };

    } catch (error) {
        console.error('Error generating story:', error.response ? error.response.data : error.message);
    }
}

// // 사용 예제
// generateStory('Friendship', 'Helping each other is important.')
//     .then(result => {
//         console.log('Generated Story:', result.paragraphs);
//         console.log('Endpoints:', result.endpoints);
//         console.log('Generated Images URLs:', result.images);
//     });

module.exports = {
    generateStory,
    generateImage
};