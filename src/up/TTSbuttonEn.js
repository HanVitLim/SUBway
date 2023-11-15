import React from "react";
import axios from "axios";
import Button from '@mui/material/Button';

const TTSButtonEn = ({ text, transdata }) => {
  const handleTTS = async () => {
    console.log('handleTTS : {text} = ', {text});
    try {
      console.log("영어 읽어주기 시도 : ");
      // 서버의 ttsApi 라우터로 요청을 보냅니다.
      const response = await axios.post(`/api/tts`, { text });
      console.log('응답 내용 :', response);

      // HTTP 상태 코드 확인
      if (response.status === 200) {
      // 음성 파일을 성공적으로 생성하면 응답에서 파일의 경로를 얻습니다.
      
      const audioFilePath = response.data.audioFilePath;
      console.log("받아온 파일경로 : ",audioFilePath);

      // 생성된 음성 파일을 재생하려면 HTML5 audio 요소를 사용합니다.
      const audioElement = new Audio(audioFilePath);
      audioElement.play();
      } else {
        // 다른 상태 코드에 대한 처리
        console.error(`서버에서 오류 응답 받음. 상태 코드: ${response.status}`);
      }
    } catch (error) {
      console.error('음성 파일 생성 및 재생 중 오류 발생:', error);
    }
  };

  const handleTTS_kor = async () => {
    console.log('handleTTS : {text} = ', {transdata});
    try {
      console.log("한글 읽어주기 시도 : ");
      // 서버의 ttsApi 라우터로 요청을 보냅니다.
      const response = await axios.post(`/api/tts_kor`, { transdata });
      console.log('응답 내용 :', response);

      // HTTP 상태 코드 확인
      if (response.status === 200) {
      // 음성 파일을 성공적으로 생성하면 응답에서 파일의 경로를 얻습니다.
      
      const audioFilePath = response.data.audioFilePath;
      console.log("받아온 파일경로 : ",audioFilePath);

      // 생성된 음성 파일을 재생하려면 HTML5 audio 요소를 사용합니다.
      const audioElement = new Audio(audioFilePath);
      audioElement.play();
      } else {
        // 다른 상태 코드에 대한 처리
        console.error(`서버에서 오류 응답 받음. 상태 코드: ${response.status}`);
      }
    } catch (error) {
      console.error('음성 파일 생성 및 재생 중 오류 발생:', error);
    }
  };

  return(
    <div>
      <Button component="label" variant="contained" onClick={() => handleTTS(text)}>{text} 읽기</Button>
    </div>
  )
};

export default TTSButtonEn;
