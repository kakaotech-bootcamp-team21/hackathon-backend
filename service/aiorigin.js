const axios = require('axios');
require('dotenv').config();

// OpenAI API 키 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

// 문장 분리 및 문단 엔드포인트 추출 함수
function getParagraphsAndEndpoints(text) {
  // 텍스트를 문장 단위로 분리
  const sentences = text.trim().split(/(?<=[.!?]) +/);  // 정규식을 사용하여 문장 분리
  const paragraphs = [];
  const endpoints = [];
  let startIndex = 0;

  // 두 문장씩 묶어서 문단으로 생성
  for (let i = 0; i < sentences.length; i += 2) {
    const paragraph = sentences.slice(i, i + 2).join(' ');
    paragraphs.push(paragraph);

    // 각 문단의 시작과 끝 인덱스 계산
    const endIndex = startIndex + paragraph.length;
    endpoints.push([startIndex, endIndex]);
    // 다음 문단의 시작 인덱스 업데이트
    startIndex = endIndex + 1;  // 문장 사이의 공백을 고려한 인덱스 추가
  }

  return { paragraphs, endpoints };
}

// 이미지 생성 함수
async function generateImageOrigin(description) {
  try {
    const response = await axios.post(
      `${OPENAI_API_URL}/images/generations`,
      {
        model: 'dall-e-3',
        prompt: description,
        n: 1,
        size: '1024x1024'
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
async function generateStoryOrigin(changestory, ifstory) {
  // 프롬프트 설정
  console.log("generateStoryOrigin start!")
  const prompt = `
    You are a storyteller for children. Use only nice words.
    Story creation guidelines:
    Tell me the story of '${changestory}'.
    Change the ending to match '${ifstory}'.

    General instructions:
    - The story should be 50 words long.
    - Use simple language appropriate for young children.
    - Maintain a warm, nurturing tone as if a parent is telling the story.
    - Write the story in Korean.
  `;

  // GPT 모델 호출
  try {
    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: prompt
          },
          {
            role: "user",
            content: `${changestory} is 'Snow White', ${ifstory} is 'if Snow White hadn't eaten the poisonous apple'`
          },
          {
            role: "assistant",
            content: `Once upon a time, deep in the forest, there lived a beautiful girl named Snow White... (이하 생략)`
          },
          {
            role: "user",
            content: `${changestory} is 'Cinderella', ${ifstory} is 'If Cinderella hadn't lost her glass slipper'`
          },
          {
            role: "assistant",
            content: `Once upon a time, there was a beautiful girl named Cinderella... (이하 생략)`
          },
          {
            role: "user",
            content: `${changestory}, ${ifstory}`
          }
        ],
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 생성된 이야기 가져오기
    const story = response.data.choices[0].message.content;

    // 문단과 엔드포인트 추출
    const { paragraphs, endpoints } = getParagraphsAndEndpoints(story);

    // 각 문단에 대한 이미지 생성
    const images = [];
    for (const paragraph of paragraphs) {
      const imageUrl = await generateImageOrigin(paragraph);
      images.push(imageUrl);
    }
    console.log("generateStoryOrigin end!")
    return { paragraphs, endpoints, images };
    
  } catch (error) {
    console.error('Error generating story:', error.response ? error.response.data : error.message);
  }
}

// // 사용 예시
// generateStory('Snow White', 'if Snow White hadn\'t eaten the poisonous apple')
//   .then(result => {
//     console.log('Generated Story Paragraphs:', result.paragraphs);
//     console.log('Paragraph Endpoints:', result.endpoints);
//     console.log('Generated Images URLs:', result.images);
//   });

module.exports = {
    generateStoryOrigin,
    generateImageOrigin
};