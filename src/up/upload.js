import axios from "axios";
import React, { useState,  useRef } from "react";
import { convertToBase64 } from "./convertimg";
import { Nameclick } from "./buttonclick";
import TTSButtonEn from "./TTSbuttonEn";
import TTSButtonKo from "./TTSbuttonKo";
import BoxDraw from "./boxDraw";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ButtonGroup from '@mui/material/ButtonGroup';
import ccc from '../img/ccc.png'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
}); // a

const parentStyle = {
  display: 'flex',
  justifyContent: 'center',  // 가로 방향으로 가운데 정렬 추가
};

const centerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%', // Vertical centering
  textAlign: 'center', // Horizontal centering
};

export default function FileUpload() {

  const [files, setFiles] = useState(null);
  const [imgDataURL, setImgDataURL] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [imgSize, setImgSize] = useState(null);
  const [transdata, setTransData] = useState(null);
  const [open, setOpen] = React.useState(false); // a

  const handleClose = () => {
    setOpen(false);
  };

  const {nameData, handleNameClick, setNameData} = Nameclick();
  const canvasContextRef  = useRef(null);

  function remove(arr){
    return [...new Set(arr)];
  }

  const onChangeFiles = (e) => {
    const fileList = e.target.files;
    if (fileList !== null) {
      setFiles(fileList);

      convertToBase64(fileList[0])
      .then(({ base64, orginalheights, orginalwidths, resizeheights, resizewidths }) => {
        // 여기서 base64 및 다른 데이터를 사용할 수 있음
        setImgDataURL(base64);

      })
      .catch((error) => {
        console.error("Error converting to base64:", error);
      });
  
      // 이미지를 미리보기로 표시
     // const selectedImgURL = URL.createObjectURL(fileList[0]);
      //setImgDataURL(selectedImgURL);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);

    const selectedImgURL = URL.createObjectURL(files[0]);
    setImgDataURL(selectedImgURL);
  };

  const upload = async (e, ctx) => {
    
    e.preventDefault();
    const formData = new FormData();
    Array.from(files).forEach((el) => {
      formData.append("userfile", el);
    });
    
    try {
      const responsedata = await axios.post(`/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [
          function () {
            return formData;
          },
        ],
      });

      // 기존에 그려진 사각형과 텍스트 지우기
      nameData.forEach((data) => {
        const { re_x1, re_y1, re_x2, re_y2 } = data;
        console.log("aaaa " + data.re_x1);
        ctx.clearRect(0, 0, re_y2 - re_y1, re_x2 - re_x1);
      });

      setNameData([]);

      const {base64: base64Data, orginalheights, orginalwidths, resizeheights, resizewidths} = await convertToBase64(files[0]); // 첫 번째 파일만 변환
      setImgDataURL(base64Data);

      const apiclassData = JSON.parse(responsedata.data.apiclass); 

      const imgclasses = apiclassData.return_object.data.filter(item=> item.confidence >= 0.95).map(item=> item.class);
      const imgxs = apiclassData.return_object.data.filter(item=> item.confidence >= 0.95).map(item=> item.x);
      const imgys = apiclassData.return_object.data.filter(item=> item.confidence >= 0.95).map(item=> item.y);
      const imgwidths = apiclassData.return_object.data.filter(item=> item.confidence >= 0.95).map(item=> item.width);
      const imgheights = apiclassData.return_object.data.filter(item=> item.confidence >= 0.95).map(item=> item.height);
      const imgconfis = apiclassData.return_object.data.filter(item=> item.confidence >= 0.95).map(item=> item.confidence);
      const nameclasses = remove(imgclasses);

      setImgData({
        imgclass : imgclasses,
        imgx : imgxs,
        imgy : imgys,
        imgheight : imgwidths,
        imgwidth : imgheights,
        imgconfi : imgconfis,
      })

      setImgSize({
        orginalwidth : orginalwidths,
        resizewidth : resizewidths,
        orginalheight : orginalheights,
        resizeheight : resizeheights,
      });

    const traslateData = async (data) => {
        try{

        const resTransData = await axios.get('/api/translate', {
          params:{
            data : data,
          },

      });

      console.log(resTransData)

      try {
        const transNameData = resTransData.data;
        const engData = transNameData.map(item => item.eng);
        const korData = transNameData.map(item => item.kor);
  
        setTransData({
          eng: engData,
          kor: korData,
        });
      } catch (jsonError) {
        console.error("JSON 파싱 오류:", jsonError);
      }

    } catch(error){
      console.error(error)
    }
    };

    traslateData(nameclasses);
    console.log("성공");
    } catch (error) {
      alert("확인할 수 있는 이미지를 넣어주세요");
      console.log(error);
    }
  };
  return (
    
    <div style={{ backgroundImage: `url(${ccc})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <div style={parentStyle}>
      <div style={centerStyle}>
        <div style={{ textAlign: 'center', width: '100%', margin: 'auto' }}>
        <form onSubmit={(e) => upload(e, canvasContextRef.current)} encType="multipart/form-data" style={{ textAlign: 'center', width: '100%', margin: 'auto' }}>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <ButtonGroup>
    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} name="userfile" multiple accept="image/*" >
      <span>확인하고 싶은 그림을 선택해 주세요</span>
      <VisuallyHiddenInput type="file" onChange={onChangeFiles} />
    </Button>

    <Button style={{ backgroundColor: 'transparent', border: 'none' }} disabled>
    {/* You can add any content inside the transparent button */}
  </Button>

    <Button variant="contained" endIcon={<SendIcon />} type="submit" onClick={handleClickOpen}>
      그림 확인 하기
    </Button></ButtonGroup>
  </div>

  {/* Dialog 부분은 그대로 유지 */}
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >

    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        어떤 사물인지 확인 되었습니다!
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} autoFocus>
        확인
      </Button>
    </DialogActions>
  </Dialog>
</form>
              <p></p>
              <BoxDraw nameData={nameData} imgDataURL={imgDataURL} canvasContextRef={canvasContextRef} /><br />
              <p></p>
              {imgData && imgSize && transdata && (
                      <div>
                      {transdata && transdata.eng.map((engName, index) => (
                        <div key={index}>
                          <ButtonGroup variant="contained" aria-label="outlined primary button group">
                          <Button variant="outlined" href="#outlined-buttons" type="button" onClick={() => handleNameClick(engName, imgData, imgSize)} value={engName}>{engName}</Button>
                          <TTSButtonEn text={engName} />
                          </ButtonGroup> 
                          &nbsp;
                          <ButtonGroup variant="contained" aria-label="outlined primary button group">                          
                          <Button variant="outlined" href="#outlined-buttons" type="button" onClick={() => handleNameClick(engName,imgData,imgSize)} value={engName}>{transdata.kor[index]}</Button>
                          <TTSButtonKo transdata={transdata.kor[index]} />
                          </ButtonGroup> 
                          <p></p>
                          <br />
                        </div>
                      ))}
                      </div>
          )}
    </div>
    </div>
    </div>
    </div>
  );
}
