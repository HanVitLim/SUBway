import { useEffect, useState } from "react";

export const Nameclick = () => {

    const [nameData, setNameData] = useState([]);

      const handleNameClick = (removename, imgData, imgSize) => {
        console.log("============================================");

        // ./up/upload.js에서 정의한 useState가져옴
        // setImgSize로 정의한 useState
        // return 에서  {imgData && nameclass && imgSize && ()}로 사용한 값을 가져온다.
        console.log("클래스명 : " + removename);
        console.log("이미지 데이터 [클래스명] : ", imgData.imgclass);
        console.log("원본 : 리사이즈 width => " + imgSize.orginalwidth + " : " + imgSize.resizewidth);
        console.log("원본 : 리사이즈 height => " + imgSize.orginalheight + " : " + imgSize.resizeheight);
        
        // 가로변환비, 세로변환비 소수점 둘째자리까지
        //var ratiotest= imgSize.resizewidth / imgSize.orginalwidth;
        // console.log("비율 테스트 : " + ratiotest );
        var w_ratio = Math.floor((imgSize.resizewidth / imgSize.orginalwidth)*100) / 100;
        var h_ratio = Math.floor((imgSize.resizeheight / imgSize.orginalheight)*100) / 100;
        
        console.log("원본 : 리사이즈 비율 :: width, height => " + w_ratio + ", " + h_ratio );


        var arrData =  [];
        var k = 1;
        for(var a = 0; a < imgData.imgclass.length; a++){
            var cls = imgData.imgclass[a];
            if (removename === imgData.imgclass[a]){
              
              console.log("<<<<<<<<<<<<<<<< " + cls + "["+ String(k) + "] 좌표 >>>>>>>>>>>>>>>>");
            
              // String으로 받아오므로 덧셈을 위해서 parseInt해줌
              var x1 = parseInt(imgData.imgx[a]);
              var y1 = parseInt(imgData.imgy[a]);
              var x2 = x1 + parseInt(imgData.imgwidth[a]);
              var y2 = y1 + parseInt(imgData.imgheight[a]);

              console.log("변환전 (x1, y1), (x2, y2) => (" + x1 +", " + y2 + "), (" + x2 +", " + y2 +")");

              // 원본과 리사이즈 width, height 비율을 기초로 x, y좌표 다시 설정
              // 좌표값은 픽셀단위이므로 소수점 절삭(내림, Math.floor())
              var re_x1 = parseInt(Math.floor(imgData.imgx[a]*w_ratio));
              var re_y1 = parseInt(Math.floor(imgData.imgy[a]*h_ratio));
              var re_x2 = Math.floor(x2 * w_ratio);
              var re_y2 = Math.floor(y2 * h_ratio);
              var size = parseInt(imgData.imgwidth[a]) * parseInt(imgData.imgheight[a]);
              
              console.log("변환 후 (x1, y1), (x2, y2) => (" + re_x1 +", " + re_y1 + "), (" + re_x2 +", " + re_y2 +")");     
              
              var Classname = cls;
                            const tmpDataInput = {
                Classname,
                re_x1,
                re_y1,
                re_x2,
                re_y2,
                size,

              }
              console.log("현재배열 : ", tmpDataInput);
              arrData = arrData.concat(tmpDataInput);
              k +=1;
            } // end of if
          } // end of for
          console.log("최종배열 : ", arrData);

          const filteredArray = arrData.reduce((acc, curr) => {
            const existingElement = acc.find(item => item.class === curr.class);
        
            if (!existingElement || curr.size > existingElement.size) {
              return acc.filter(item => item.class !== curr.class).concat(curr);
            } else {
              return acc;
            }
          }, []);
          
          // nameDate 상태를 업데이트
          setNameData([...filteredArray]);
          
       } // end of handleNameClick()
       
       useEffect(() => {
        // nameData가 업데이트될 때마다 실행
        console.log("최종 nameData : ", nameData);
        
       }, [nameData]);
    
    return{nameData, handleNameClick, setNameData};
};