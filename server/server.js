const express = require('express');
const app = express();
const upload = require('./router/uploadFiles');
const translate = require('./router/translate')
const cors = require('cors'); // cors 모듈 추가
const tts = require('./router/ttsApi');
const tts_kor = require('./router/ttsApi_kor');
const bodyParser = require('body-parser');

require('dotenv').config();

// CORS설정
app.use(cors());

app.use(bodyParser.json());
app.use(express.static('audio')); // 음성파일이 저장된 디렉토리이름

app.use('/api/upload', upload);
app.use(express.static("./uploads"));
app.use(express.urlencoded({extended:true}));
app.use('/api/translate', translate);
app.use('/api/tts', tts); //ttsApi 라우터를 연결

app.use('/api/tts_kor', tts_kor); //ttsApi 라우터를 연결(한글)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listenig on port ${port}`));