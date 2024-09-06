import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/recoilState';
import PropTypes from 'prop-types';

// imgFile props에 대한 유효성 검사를 추가
InputPhoto.propTypes = {

    // imgFile은 File 객체로 전달되어야 합니다.
    imgFile: PropTypes.instanceOf(File),
    
  };

function InputPhoto() {
    //페이지 이동 부분
  const Navigate = useNavigate();

    // 이미지 사이즈
    const [imgFile, setImgFile] = useState(null);
    const [imgDimensions, setImgDimensions] = useState({width: 0, height: 0});

  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if(!isLoggedIn){
    Navigate('/');
  }
  // useEffect를 사용하여 컴포넌트가 마운트될 때 토큰을 가져옵니다.
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setjwtToken(token);
  }, []);

  //파일 첨부 기능
  //파일 input 참조
  const fileInputRefs = useRef([]); // 여러 파일 입력을 관리하기 위한 참조(배열)
  const [imagePreviews, setImagePreviews] = useState({}); // 미리보기 이미지 URL을 저장할 객체

  const [jwtToken, setjwtToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imgFile) {
      const img = new Image();
      img.onload = () => {
        setImgDimensions({ width: img.width, height: img.height });
        console.log('규격', imgDimensions);
    };
    img.src = URL.createObjectURL(imgFile);
    }
  }, [imgFile, Navigate]);

  


//   const handleFileChange = (event) => {

//     console.log('handleFileChange called', event); // 디버깅용 로그


//     if (event.target && event.target.files) {
//       const file = event.target.files[0];
//       if (file) {
//         // 파일 처리 로직 추가
//         console.log('Selected file:', file);
        
//         // 이미지 파일인지 확인
//         if (file.type.startsWith('image/')) {

//           //로그 찍어보려고 추가
//           const formData = new FormData();
//           formData.append('file', file);
//           // FormData에 추가된 파일 확인
//           for (let [key, value] of formData.entries()) {
//             console.log(`${key}: ${value.name}`);
//           }
          
//           setImgFile(file);
//            // 서버로 파일 전송
//            uploadFile(); // 파일을 함수의 인자로 전달

//            // 이미지 파일인 경우 로딩 페이지로 전달
//           //Navigate('/loading', { state: { imageData: URL.createObjectURL(file)} });
          

//         } else {
//           // 이미지 파일이 아닌 경우 경고 메시지 출력
//           console.error('Selected file is not an image.');
//         }
//       } else {
//         console.error('No file selected.');
//       }
//     } else {
//       console.error('Event target or files not available.');
//     }
//   };


const handleFileChange = (index) => (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, [index]: reader.result }));
      };
  
      reader.readAsDataURL(file); // 파일을 읽어 데이터 URL로 변환
    } else {
      console.error('선택된 파일이 이미지가 아니거나 파일이 선택되지 않았습니다.');
    }
  };
  

    //파일 업로드 함수
    const uploadFile = async () => {

  
      if (!jwtToken) {
          console.error("User not authenticated");
          return;
      }
    
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0];
  
      
      if (!file) {
        console.error("No file selected");
        return;
      }
  
      // FormData 객체 생성
      const formData = new FormData();
      formData.append('file', file);

        
      setIsLoading(true);

      // 로그 추가: 요청 전송 직전
      console.log('Sending POST request to server with form data:', formData);
    
      try {
        // 서버로 POST 요청 보내기
        const response = await fetch('https://dev.catchmind.shop/api/picture', {
          method: 'POST',
          headers: {
  
          //'Accept': '*/*',
          //'Content-Type': 'multipart/form-data', // 파일 업로드시에는 Content-Type을 multipart/form-data로 설정합니다.
          'Authorization': `Bearer ${jwtToken}`, // 사용자 토큰을 헤더에 포함하여 서버로 전송
  
          },
          body: formData,
        });
    
        // 응답 확인
        if (response.ok) {
          const data = await response.json();
          console.log('File uploaded successfully:', data);
           // 파일 업로드 성공 후 result 페이지로 이동
           Navigate('/result', { state: { response: data } });
        } else {
          console.error('File upload failed', await response.text());
        }
      } catch (error) {
        console.error('Error uploading file:', error.response.status, error.response.statusText);
      } finally {
        setIsLoading(false); // 업로드 완료 시 로딩 상태 비활성화
      }
    };
    
    //함수 호출
    //uploadFile();

  const handleButtonClick = (index) => () => {
    // 파일을 선택하기 위해 input 요소 클릭
    fileInputRefs.current[index].click();
  };

  const uploadTexts1 = [
    "집 그림을 첨부해주세요.",
    "남자 사람 그림을 첨부해주세요.",
    "나무 그림을 첨부해주세요.",
    "여자 사람 그림을 첨부해주세요."
  ];

  const uploadTexts2 = [
    "종이를 가로 방향으로 그려주세요.",
    "종이를 세로 방향으로 그려주세요.",
    "종이를 세로 방향으로 그려주세요.",
    "종이를 세로 방향으로 그려주세요."
  ];



  return (
    <OuterContainer>
      <InnerContainer>
        <InnerWrapper>

        <OneBox>
          <Text>사진 첨부</Text>
        <PhotoBox>
        <Row>
            {Array.from({ length: 2 }).map((_, index) => (
            <PutPhoto key={index} onClick={handleButtonClick(index)}>
                {/* 이미지 미리보기 또는 업로드 텍스트 */}
                {imagePreviews[index] ? (
                <img src={imagePreviews[index]} alt={`Image Preview ${index}`} style={{ width: '100%', maxHeight: '200px', borderRadius: '10px' }} />
                ) : (
                <>
                <PutPhotoText1>{uploadTexts1[index]}</PutPhotoText1>
                <PutPhotoText2>{uploadTexts2[index]}</PutPhotoText2>
                </>
                )}
                <HiddenFileInput
                type="file"
                ref={el => fileInputRefs.current[index] = el}
                onChange={handleFileChange(index)}
                accept="image/*"
                />
            </PutPhoto>
            ))}
        </Row>

        <Row>
            {Array.from({ length: 2 }, (_, i) => i + 2).map(index => (
            <PutPhoto key={index} onClick={handleButtonClick(index)}>
                {/* 이미지 미리보기 또는 업로드 텍스트 */}
                {imagePreviews[index] ? (
                <img src={imagePreviews[index]} alt={`Image Preview ${index}`} style={{ width: '100%', maxHeight: '200px', borderRadius: '10px' }} />
                ) : (
                <>
                <PutPhotoText1>{uploadTexts1[index]}</PutPhotoText1>
                <PutPhotoText2>{uploadTexts2[index]}</PutPhotoText2>
                </>
                )}
                <HiddenFileInput
                type="file"
                ref={el => fileInputRefs.current[index] = el}
                onChange={handleFileChange(index)}
                accept="image/*"
                />
            </PutPhoto>
            ))}
        </Row>

        <HiddenFileInput
            type="file"
            ref={fileInputRefs}
            onChange={handleFileChange}
            accept="image/*"
            />
        </PhotoBox>

        </OneBox>

        <TwoBox>
        <Text>소요 시간</Text>
        <Text1>아이가 그림그리기 시작한 시각과 완료한 시각을 적어주세요.</Text1>
        </TwoBox>

        <TimerBox>
        <Timer>
        <SSBox>
        <StartNStop>시작</StartNStop>
        </SSBox>
        <TimeContainer></TimeContainer>
        </Timer>

        <Timer>
        <And> ~ </And>
        </Timer>

        <Timer>
        <SSBox>
        <StartNStop>종료</StartNStop>
        </SSBox>
        <TimeContainer></TimeContainer>
        </Timer>
        </TimerBox>

        <DraButtonBox>
            <DraButton>검사 결과 보러가기</DraButton>
        </DraButtonBox>


        </InnerWrapper>
      </InnerContainer>
    </OuterContainer>
  );
}

InputPhoto.propTypes = {
    imgFile: PropTypes.instanceOf(File),
  };
  

export default InputPhoto;

// 스타일 컴포넌트 정의
const OuterContainer = styled.div`
  width: 100%;
  height: 93vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.875rem; //30px;
  display: flex;
  background: #f3f3f6;

  ${theme.media.mobile`
`}

`;

const InnerContainer = styled.div`
  width: 40.25rem; //644px;
  height: 61.815rem; //477px;
  padding-top: 2.5rem; //40px;
  padding-bottom: 2.5rem; //40px;
  justify-content: center;
  display: flex;
  background: white;
  border-radius: 0.625rem; //10px;
  margin-top: 1.875rem;
  margin-bottom: 1.875rem;

  ${theme.media.mobile`
  padding: 2rem 1rem;
  width: 80%;
  height:80%;

`}
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;
  ${theme.media.mobile`
  justify-content: flex-start;
  align-items: center;
`}
`;

const Text = styled.text`
    color: #27282B;
    text-align: center;
    font-family: Pretendard-Regular;
    font-size: 1.625rem; //26px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 39px */
    margin-bottom: 0.625rem;

  ${theme.media.mobile`
    font-size: 0.875rem;
  `}
`;

const PhotoBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-top: -0.625rem;
    width: 35.625rem;


  ${theme.media.mobile`

  
`}
`;

const PutPhoto = styled.div`
    display: flex;
    width: 17.5rem;
    height: 3.5rem;
    padding: 4.375rem 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border-radius: 0.375rem;
    border: 1px solid #E0E1E9;
    background: #FDFDFF;

  ${theme.media.mobile`

  
`}
`;

const Row = styled.div`
  display: flex;
  justify-content: space-around; // 컴포넌트 사이에 고르게 간격을 두기
  margin-bottom: 20px; // 다음 Row와의 간격
  flex-direction: column;
  gap: 0.625rem;
`;

const PutPhotoText1 = styled.text`

  ${theme.media.mobile`

  
`}
`;

const PutPhotoText2 = styled.text`

    color: #97999F;
    font-family: Pretendard-Regular;
    font-size: 0.875rem; //14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 21px */

  ${theme.media.mobile`

  
`}
`;

const Text1 = styled.text`

    color:#4D4F56;
    text-align: center;
    font-family: Pretendard-Regular;
    font-size: 0.875rem; //14px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 21px */

  ${theme.media.mobile`

  
`}
`;

const StartNStop = styled.text`

    color: #66676E;
    text-align: center;
    font-family: Pretendard-Regular;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 21px */
    width: 11.25rem;
    height: 1.313rem;

  ${theme.media.mobile`

  
`}
`;

const And = styled.div`

    display: flex;
    width: 0.688rem; //11px;
    height: 2.75rem; //44px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.875rem; //10px;
    color: #66676E;
    text-align: center;
    font-family: Pretendard-Regular;
    font-size: 1rem; //16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
    padding-right: 0.625rem;
    padding-left: 0.625rem;
    padding-top: 1.625rem;

  ${theme.media.mobile`

  
`}
`;

const OneBox = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem; //20px;
    align-self: stretch;

  ${theme.media.mobile`

  
`}
`;

const TwoBox = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;

  ${theme.media.mobile`

  
`}
`;

const TimerBox = styled.div`

    display: flex;
    width: 11.25rem;
    height: 4.688rem;
    flex-direction: row;
    align-items: center;
    text-align: center;
    justify-content: center;
    gap: 1.875rem;

  ${theme.media.mobile`

  
`}
`;

const Timer= styled.div`


  ${theme.media.mobile`

  
`}
`;

const TimeContainer= styled.div`

    display: flex;
    width: 11.25rem; //180px;
    height: 1.5rem;
    padding: 0.625rem; //10px;
    justify-content: center;
    align-items: center;
    gap: 0.625rem; //10px;
    border-radius: 0.25rem; //4px;
    background: #F3F3F6;

  ${theme.media.mobile`

  
`}
`;

const SSBox= styled.div`


    margin-bottom: 0.625rem;

  ${theme.media.mobile`

  
`}
`;

const DraButton = styled.button`
  width: 10rem; //120px;
  text-align: center;
  color: white;
  font-size: 1rem; //16px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 1.5rem; //24px;
  word-wrap: break-word;
  border: none;
  background: none;
  cursor: pointer;
`;

const DraButtonBox = styled.div`
  width: 10rem; //160px;
  height: 2.75rem; //44px;
  padding: 0 1.25rem; //0 20px;
  background: #9386E0;
  border-radius: 0.25rem; //4px;
  border: 0.0625rem solid #9386E0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.625rem;
  margin-left: 0.16rem;

  ${theme.media.mobile`
`}

`;

//파일 관련
const HiddenFileInput = styled.input`
  display: none;
`;