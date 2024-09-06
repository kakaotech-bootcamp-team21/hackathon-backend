const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const fairytaleRoutes = require('./routes/fairytale');
require('dotenv').config();

const app = express();

// AWS SDK v3로 S3 클라이언트 설정
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  


// multer 설정
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      key: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`; // UUID로 파일 이름 생성
        cb(null, filename);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
  
// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/fairytale', fairytaleRoutes);


// S3 여러 파일 업로드 핸들러
app.post('/upload', upload.array('images', 10), (req, res) => {
    // 성공적으로 업로드된 파일 정보는 req.files에 담겨 있습니다.
    if (!req.files) {
      return res.status(400).send('No files uploaded.');
    }
  
    const fileUrls = req.files.map((file) => file.location); // 파일의 URL 추출
    res.json({
      message: 'Files uploaded successfully',
      files: fileUrls,
    });
  });

// S3 특정 파일 다운로드 핸들러
app.get('/download/:filename', async (req, res) => {
    const filename = req.params.filename;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
    };
  
    try {
      // GetObjectCommand로 S3에서 파일 가져오기
      const command = new GetObjectCommand(params);
      const data = await s3.send(command);
  
      // 파일을 응답으로 전송
      res.attachment(filename); // 다운로드 시 첨부 파일로 처리
      data.Body.pipe(res); // S3의 데이터 스트림을 응답으로 보냄
    } catch (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
