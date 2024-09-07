const axios = require('axios');
require('dotenv').config();

// OpenAI API 키 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

// 문장 분리 및 문단 엔드포인트 추출 함수
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
    You are an author for children. Use only nice words.
    Tell me the story of '${changestory}'.
    Change the original story after '${ifstory}' event.

    General instructions:
    - Use simple language appropriate for young children.
    - Maintain a warm, nurturing tone as if a parent is telling the story.
    - the story should be 100-150 words long.
    - divide story to at least 5 paragraph. 
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
          { role: "user", content: `${changestory} is 'Snow White', ${ifstory} is if snow white hadn't eaten the poisonous apple` },
            { role: "assistant", content: `Once upon a time, deep in the forest, there lived a beautiful girl named Snow White. Snow White was a very pretty princess with fair skin and jet-black hair. But her stepmother, who had a bad heart, didn't like her very much. So Snow White ran away to the home of the Seven Dwarfs in the forest.

The seven dwarfs loved and cared for Snow White very much, and she was happy living with them. But the Wicked Stepmother found out through a magic mirror that Snow White was still alive.

One day, the Wicked Stepmother took a poisoned apple and tried to feed it to Snow White, but Snow White was wise enough not to eat it. ‘Thanks, but I just had lunch,’ said Snow White.

The Wicked Stepmother was so surprised by this that she ran away. When the seven dwarves returned, Snow White thanked them for trying to protect her.

‘How wise you were, Snow White! We were worrie` },
            { role: "user", content: `${changestory} is 'Cinderella', ${ifstory} is If Cinderella hadn't lost my glass slipper` },
            { role: "assistant", content: `Once upon a time, there was a beautiful girl named Cinderella. She lived with her stepmother and two stepsisters. Her stepmother and stepsisters made her do hard chores and were always mean to her. 

One day, an invitation came to a glamorous ball at the royal palace. Cinderella wanted to go, but her stepmother and stepsisters wouldn't let her. Then a beautiful fairy appeared. ‘Cinderella, do you want to go to the ball?’ the fairy asked, and Cinderella nodded.

The fairy worked her magic and made Cinderella a gorgeous dress and a beautiful glass slipper. ‘But at midnight, everything will be gone!’ the fairy warned. Cinderella smiled and nodded.

When Cinderella arrived at the ball, the Prince saw her and fell in love at first sight. They danced together and had a happy time. But time passed and the clock struck midnight. But this time, Cinderella didn't lose her glass slipper.

The prince asked her, ‘What is your name?’ Cinderella smiled and replied, ‘I'm Cinderella.’ The prince was delighted and asked, ‘So, can we meet again tomorrow?’ Cinderella nodded.

The next day, the prince came to her house and asked her to marry him. She happily accepted. Her stepmother and step-sisters realised their mistake and apologised to her, and they all lived happily ever after.

Cinderella and the prince lived happily ever after, loving each other even more because they hadn't lost the glass slipper. 

And they lived a long and happy life.` },

            { role: "user", content: `${changestory}, ${ifstory}` },
            
          ],
          temperature : 0.7
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