const express = require('express');
// Import other required libraries
const fs = require('fs');
const util = require('util');
const tts = express.Router();
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const axios = require('axios');
require('dotenv').config();

// API KEY 사용 테스트
const { GOOGLE_API_KEY } = process.env;


const ttsDir = './audio';
if (!fs.existsSync(ttsDir)){
  fs.mkdirSync(ttsDir, {recursive: true});
}

*/
tts.post('/', async (req, res) => {
    console.log("ttsApi 진입 : 영어 읽어주기");
  // The text to synthesize
  const text = req.body.text; // 클라이언트에서 텍스트를 POST 요청으로 받아옴

  console.log("text ::", text);

  // 파일 이름을 'text.mp3'로 설정
  const fileName = `${text}.mp3`;
  const filePath = `./audio/${fileName}`;

  // 파일이 존재하는지 확인, 없으면 api요청해서 새로 만들기
  if (fs.existsSync(filePath)) {
    console.log(`이미 ${fileName} 음성파일이 있습니다.`);
    res.status(200).send({ audioFilePath: fileName });

  }else{
    const apiUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize';
    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'en-US', 
              name: 'en-US-Standard-F',
              ssmlGender: 'FEMALE'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
  };

  try {

    // Google Text-to-Speech API에 API 키를 포함한 POST 요청을 보냄
    const response = await axios.post(`${apiUrl}?key=${GOOGLE_API_KEY}`, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("response :", response)
    console.log("response.data : ", response.data);
    /*
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    */
    if (response.data && response.data.audioContent) {
      // api-key로 사용하게 되면 return이 바뀜, base64로 인코딩된 것을 디코딩해주는과정
      const audioBuffer = Buffer.from(response.data.audioContent, 'base64');

      // Write the binary audio content to a local file
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(filePath, audioBuffer, 'binary');
      console.log(`음성 파일이 생성되었습니다. : ${filePath}`);
      res.status(200).send({ audioFilePath: fileName });
    }else{
      console.error('Google Text-to-Speech API에서 유효한 음성 데이터를 받지 못했습니다.');
      res.status(500).send('Error synthesizing speech');      
    }
  } catch(error) {
    console.error(error);
    res.status(500).send('Error synthesizing speech');
  }
  };
});

module.exports = tts;