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


// const handleFileChange = (index) => (event) => {
//   const file = event.target.files[0];
//   if (file && file.type.startsWith('image/')) {
//     const reader = new FileReader();
    
//     reader.onloadend = () => {
//       setImagePreviews(prev => ({ ...prev, [index]: reader.result }));
//       setImgFile(file);  // 파일을 선택한 후에 imgFile을 설정
//     };

//     reader.readAsDataURL(file); // 파일을 읽어 데이터 URL로 변환
//   } else {
//     console.error('선택된 파일이 이미지가 아니거나 파일이 선택되지 않았습니다.');
//   }
// };

const handleFileChange = (index) => (event) => {
  const file = event.target.files[0]; // 사용자가 선택한 파일
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImagePreviews(prev => ({ ...prev, [index]: reader.result }));
      setImgFile(file);  // 파일을 선택한 후에 imgFile 상태로 저장
      console.log('파일 선택 완료:', file);  // 파일 정보 로그 출력

      // 파일이 선택된 후 바로 서버로 전송
      // uploadFile(file);
    };
    reader.readAsDataURL(file); // 파일을 읽어 미리보기 URL로 변환

  } else {
    console.error('선택된 파일이 이미지가 아니거나 파일이 선택되지 않았습니다.');
  }
};
  
 // 파일 업로드 함수
 const uploadFile = async () => {
  if (!jwtToken) {
      console.error('인증권한 없음');
      return;
  }

  console.log('JWT Token:', jwtToken);


  if (!imgFile) {
      console.error('파일이 선택되지 않음');
      return;
  }

  const formData = new FormData();
  formData.append('file', imgFile);
  // formData.append('pictureType', JSON.stringify({ pictureType: 'HOUSE' })); //  'pictureType'을 추가 json 타입을 각각 지정해줘야하나 ..

   // FormData 내용 로그 출력
   for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
}

  setIsLoading(true);

  try {
      const response = await fetch('https://dev.catchmind.shop/api/picture/recognition', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${jwtToken}`, // 사용자 토큰을 헤더에 포함하여 서버로 전송
          },
          body: formData,
      });

      if (response.ok) {
          const data = await response.json();
          console.log('파일 업로드 성공:', data);
      } else {
          console.error('파일 업로드 실패', await response.text());
      }
  } catch (error) {
      console.error('Error uploading file:', error);
  } finally {
      setIsLoading(false);
  }
};

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
            // <PutPhoto key={index} onClick={handleButtonClick(index)}>
            <PutPhoto 
            key={index} 
            onClick={() => {
            handleButtonClick(index)(); // 먼저 파일 선택을 위한 클릭 이벤트 실행
            uploadFile(); // 파일 업로드 함수 실행
            }}
            >
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
        <Text1>아이가 그림그리기 시작한 시각과 완료한 시각을 적어주세요.</Text1>
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
  // height: 93vh;
  height: 90vh; // 뷰포트의 전체 높이
  overflow-y: auto; /* 수직 스크롤 활성화 */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.875rem; //30px;
  display: flex;
  background: #f3f3f6;

`;

const InnerContainer = styled.div`
  width: 40.25rem; //644px;
  // height: 61.815rem; //477px;
  height: 85vh; // 뷰포트의 전체 높이
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
      flex-direction: column;
  
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

    ${theme.media.mobile`

      flex-direction: column;
`}
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