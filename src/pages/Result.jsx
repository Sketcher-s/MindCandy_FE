import ResultButton from '../components/Result/ResultButton';
import ResultContent from '../components/Result/ResultContent';
import { theme } from '../theme';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation ,useNavigate } from 'react-router-dom';
import home from '../assets/Result/Home.svg';
import tree from '../assets/Result/tree.svg';
import man from '../assets/Result/Man.svg';
import woman from '../assets/Result/Woman.svg';
import homeImage from '../assets/Result/homeImage.svg';
import nextR from '../assets/Result/nextR.svg';
import nextL from '../assets/Result/nextL.svg';
import nextRDis from '../assets/Result/nextRDis.svg';
import nextLDis from '../assets/Result/nextLDis.svg';
import treeImg from '../assets/Result/treeImg.svg';
import manImg from '../assets/Result/manImg.svg';
import womanImg from '../assets/Result/womanImg.svg';
import axios from 'axios';
import listMy from '../assets/mypage/listMy.svg'

function Result() {
  const location = useLocation();
  const Navigate = useNavigate();
  const [title, setTitle] = useState(location.state?.response?.result.title); // 초기값은 이름을 입력해주세요. 마이페이지에서 왔으면, title 값 유지하고 있어야 함
  //const [id ,setId] = useState(0);
  const [pictureImg, setPictureImg] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');
  const isFromMyPage = location.state?.response?.fromMyPage ?? false;
  const [isEditing, setIsEditing] = useState(!isFromMyPage);  
  const jwtToken = localStorage.getItem('jwtToken');  // 로컬 스토리지에서 토큰을 가져옵니다.
  const resultId = location.state?.resultId || location.state?.response.result.id;
  const [canSave, setCanSave] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // 모바일 규격 감지
  const [slideshowIndex, setSlideshowIndex] = useState(0); // 슬라이드 인덱스
  //const pictures = [homeImage, treeImg, manImg, womanImg, homeImage];
  const [pictureList, setPictureList] = useState([]);
  const [pictureType, setPictureType] = useState('');
  // 그림 이동 버튼
  const totalSteps = pictureList.length+1; // List의 총 갯수
  const [currentStep, setCurrentStep] = useState(0); // 현재 선택된 페이지 (0부터 시작)
  const [modalImage, setModalImage] = useState(null); // 모달에 띄울 이미지
  const [resultContent, setResultContent] = useState(''); // 종합 결과
  // 종합 결과 이미지
  const [totalImage, setTotalImage] = useState('');

  useEffect(() => {
    // 모바일 환경인지 감지
    const checkIfMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    let intervalId;

    if (currentStep === totalSteps - 1 && isMobile) {
      // 2초 간격으로 이미지 슬라이드
      intervalId = setInterval(() => {
        setSlideshowIndex((prevIndex) => (prevIndex + 1) % pictureList.length);
      }, 2000);
    }
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentStep, isMobile]);

  const handleMyPageClick = async () => {
    // if (!title || title.length > 15) {
    //   alert('제목은 필수이며, 15자를 넘지 말아주세요.');
    //   return;
    // }
    //Navigate('/mypage', { state: { resultId, title } });
    if (!jwtToken) {
      console.error('토큰오류임');
      return;
    }
    if(title != null){
      console.log('제목: ', title);
      console.log('id: ', resultId);
    
      try {
        const response = await axios.patch('https://dev.catchmind.shop/api/picture/title', 
          { resultId, title }, // 데이터
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
          },
        );
        // 제목 수정 후 서버에서 최신 데이터 다시 가져오기
        const updatedResponse = await axios.get(`https://dev.catchmind.shop/api/picture/${resultId}`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
        });
  
        const updatedData = updatedResponse.data;
        setTitle(updatedData.result.title);  // 업데이트된 제목 반영
  
        // 마이페이지로 이동 (상태 전달 없이 서버에서 데이터 새로 불러오도록)
        Navigate('/mypage', { state: { resultId } });
        console.log('제목 저장: ', response);
      } catch (error) {
        console.error('제목 저장 실패:', error);
      }
    }else{
      Navigate('/mypage', { state: { resultId } });
    }
  };

  function handleMainClick() {
    Navigate('/');
    window.scrollTo(0, 0);
  }
  useEffect(() => {
    console.log('fromePage',location.state?.fromMyPage);
    console.log(location.state); // 전체 state 로깅
    if (location.state?.fromMyPage) {
      setIsEditing(false);  // 마이페이지에서 온 경우
    } else {
      setIsEditing(true);  // 다른 경우 (기본 설정)
    }
  }, [location.state]);

  
  // 결과 상세 조회
  useEffect(() => {
    const fetchPictureDetails = async () => {
      if (!jwtToken) {
        console.error('Authentication token is not available');
        return;  
      }
      try {
        const response = await fetch(`https://dev.catchmind.shop/api/picture/${resultId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,  // 헤더에 토큰을 포함시킵니다.
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const responseData = await response.json();
        if (responseData && responseData.pictureList) {
          console.log('responseData', responseData);
          setPictureList(responseData.pictureList);  // 그림 목록 저장
          setPictureImg(responseData.pictureList[0]?.imageUrl);  // 첫 번째 이미지
          setAnalysisResult(responseData.pictureList[0]?.content);  // 첫 번째 컨텐츠
          setPictureType(responseData.pictureList[0]?.pictureType); // 타입
          setResultContent(responseData.result.content); // 종합 결과
          setTotalImage(responseData.picutreList[0].imageUrl);
        } else {
          throw new Error('No valid response data');
        }

      } catch (error) {
        console.error('데이터받아오는거 결과값', error);  // 오류 로깅
      }
    };
  
    fetchPictureDetails();
  }, [jwtToken, resultId, location.state]);  // 의존성 배열에 jwtToken과 pictureId 추가

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    validateTitle(event.target.value);
  };

  const validateTitle = (inputTitle) => {
    if (inputTitle.length > 15) {
      setError('제목은 15자 이내로 입력해주세요.');
      setCanSave(false);
    } else if (!inputTitle) {
      setError('제목을 입력해주세요.');
      setCanSave(false);
    } else {
      setError('');
      setCanSave(true);
    }
  };
  
  // Next 버튼 클릭 시 다음 그림과 내용 보여주기
  const handleNextClick = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setPictureImg(pictureList[nextStep]?.imageUrl || pictureList[0].imageUrl); // 맨 마지막엔 첫 이미지로
      setAnalysisResult(pictureList[nextStep]?.content || pictureList[0]?.content); // 맨 마지막엔 첫 번째 컨텐츠로
      setPictureType(pictureList[nextStep]?.pictureType);
    } 
  };

  // Previous 버튼 클릭 시 이전 그림과 내용 보여주기
  const handlePrevClick = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setPictureImg(pictureList[prevStep]?.imageUrl); // 이전 이미지로 변경
      setAnalysisResult(pictureList[prevStep]?.content); // 이전 컨텐츠로 변경
      setPictureType(pictureList[prevStep]?.pictureType); // 이전 그림 타입으로 변경
    }
  };

  // 모달을 여는 함수
  const handleModalOpen = (index) => {
    setModalImage(pictureList[index].imageUrl);
    setPictureType(pictureList[index].pictureType);
  };

  // 모달을 닫는 함수
  const handleModalClose = () => {
    setModalImage(null);
  };

  // 영어 -> 한글 타입 변환
  const getPictureTypeName = (type) => {
    switch (type) {
      case "HOUSE":
        return `"집"`; // 따옴표 포함
      case "TREE":
        return `"나무"`; // 따옴표 포함
      case "MALE":
        return `"남자 사람"`; // 따옴표 포함
      case "FEMALE":
        return `"여자 사람"`; // 따옴표 포함
      default:
        return "모든"; // 기본적으로 원래 값을 따옴표 포함하여 반환
    }
  };
  
  return (
    <div>
      <Wrapper>
        <DrawingSection>
          <TopContainer>
            <Title>{getPictureTypeName(pictureType)} 그림에 대한 검사 결과</Title>
            {!isMobile && currentStep === totalSteps - 1 && (
              <InfoContainer>
                <LookContainer onClick={() => handleModalOpen(0)}>
                  <LookImg src={home} />집
                </LookContainer>
                <LookContainer onClick={() => handleModalOpen(1)}>
                  <LookImg src={tree} />나무
                </LookContainer>
                <LookContainer onClick={() => handleModalOpen(2)}>
                  <LookImg src={man} />남자 사람
                </LookContainer>
                <LookContainer onClick={() => handleModalOpen(3)}>
                  <LookImg src={woman} />여자 사람
                </LookContainer>
              </InfoContainer>
            )}
          </TopContainer>
          <DrawResult>
            <NextL onClick={handlePrevClick} disabled={currentStep === 0}>
              <img
                src={currentStep === 0 ? nextLDis : nextL}
                alt="Previous"
                style={{ cursor: currentStep === 0 ? 'not-allowed' : 'pointer', width: '100%' }} // 비활성화 시 커서 변경
              />
            </NextL>
            {isMobile && currentStep === totalSteps - 1 ? (
            // 모바일 규격에서 이미지 슬라이드
              <ImageContainer>
                <StyledImage src={pictureList[slideshowIndex]?.imageUrl || pictureList[0]?.imageUrl} alt="Slideshow Image" />
              </ImageContainer>
            ) : currentStep === totalSteps - 1 ? (
                <TotalImageContainer >
                  <StyledImage1 src={pictureImg} alt="Drawing for Analysis"/>
                </TotalImageContainer>
              ) : (
                <ImageContainer>
                 <StyledImage src={pictureImg} alt="Drawing for Analysis"/>
              </ImageContainer>
            )}
            
            <NextBtn onClick={handleNextClick} disabled={currentStep === totalSteps - 1}>
              <img
                src={currentStep === totalSteps - 1 ? nextRDis : nextR}
                alt="Next"
                style={{ cursor: currentStep === totalSteps - 1 ? 'not-allowed' : 'pointer', width: '100%' }} // 비활성화 시 커서 변경
              />
            </NextBtn>
          </DrawResult>
          <ListContainer>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <List
                key={index}
                isActive={index === currentStep} // 현재 단계와 일치하는지 여부에 따라 배경색 변경
              />
            ))}
          </ListContainer>
          {currentStep === totalSteps - 1 && (
            <TitleSection>
              <TitleInput
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="그림의 제목을 입력하세요"
                // readOnly={!isEditing}
                //isError={error.length > 0}
              />
            </TitleSection>
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
                
          {/* <AnalysisResult>{analysisResult}</AnalysisResult> */}
      
          <ResultContent analysisResult={currentStep === totalSteps - 1 ? resultContent : analysisResult}/>
          <ButtonBox>
            <MainButtonBox >
              <MainButton onClick={handleMainClick}>메인페이지로 이동</MainButton>
            </MainButtonBox>
            <MyPageButtonBox >
              <MyPageButton onClick={handleMyPageClick}>마이페이지로 이동</MyPageButton>
            </MyPageButtonBox>
          </ButtonBox>
        </DrawingSection>
      </Wrapper>
      {modalImage && <Modal image={modalImage} onClose={handleModalClose} type={pictureType}/>}
    </div>
  );
}
export default Result;

// 모달 컴포넌트
const Modal = ({ image, onClose, type }) => {

  // 영어 -> 한글 타입 변환
  const getPictureTypeName = (type) => {
    switch (type) {
      case "HOUSE":
        return "집"; // 따옴표 포함
      case "TREE":
        return "나무"; // 따옴표 포함
      case "MALE":
        return "남자 사람"; // 따옴표 포함
      case "FEMALE":
        return "여자 사람"; // 따옴표 포함
      default:
        return "집"; // 기본적으로 원래 값을 따옴표 포함하여 반환
    }
  };
  return (
    <ModalWrapper onClick={onClose}>
      <ModalContent>
        <ModalTitle>{getPictureTypeName(type)}</ModalTitle>
        <img src={image} alt="Modal" style={{ width: '80%', height: '80%', objectFit: 'contain' }}/>
        <Button><ButtonText>닫기</ButtonText></Button>
      </ModalContent>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  height: 90%;
  background: white;
  padding: 4rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  gap: 5%;
  img {
    width: 80%;
    height: 80%;
    background-color: #F3F3F6;
    border: 1px solid #E0E1E9;
    border-radius: 6px;
  }
`;

const ModalTitle = styled.h1`
  font-size: 26px;
  margin: 0;
`;

// 버튼 스타일
const Button = styled.button`
  width: 10rem; // 160px to rem
  height: 2.75rem; // 44px to rem
  padding-left: 1.25rem; // 20px to rem
  padding-right: 1.25rem; // 20px to rem
  background: #9386E0;
  border-radius: 0.25rem; // 4px to rem
  justify-content: center;
  border: none;
`;

// 버튼 내부 텍스트 스타일
const ButtonText = styled.h1`
  font-size: 16px;
  color: white;
`;

const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;


  background: #f3f3f6;
  display: flex;
  flex-direction: column;
  align-items: center; // 중앙 정렬
  justify-content: center; // 중앙 정렬
  padding: 3rem 0; // 상하 패딩
  ${theme.media.mobile`
  
  `}
`;

const DrawingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%; // 기본 화면에서의 너비
  height: auto;
  background: white;
  border-radius: 0.8rem;
  padding: 1.9rem 3.2rem; // 데스크탑에서의 패딩
  ${theme.media.mobile`  
    width: 76%;
    padding: 1.3rem 1.3rem;
  `}
`;
const TitleSection = styled.div`
  display: flex;
  width: 100%;
  ${theme.media.mobile`  
    margin-top: 1rem;
  `}
`;

// const ResultSection = styled.div`
//   width: 100%;
// `;

const TitleInput = styled.input`
  width: 100%;
  height: 1.875rem;
  font-size: 1.625rem;
  font-weight: bold;
  border: none;
  border-bottom: 0.125rem solid transparent;
  &:focus {
    outline: none;
    border-bottom: 0.125rem solid #A49EE7;
  }
  border-bottom-color: ${props => props.isError ? '#A49EE7' : 'transparent'};
  &::placeholder {
    color: rgb(177, 178, 184);
    ${theme.media.mobile`
      font-size: 0.9rem;
    `}
  }
  ${theme.media.mobile`
    width:100%;
    font-size: 0.9rem;
  `}
`;
const ImageContainer = styled.div`
  display: flex;
  width: 80%;
  height: 30rem;
  justify-content: center;
  background-color: #F3F3F6;
  ${theme.media.mobile`
    max-height: 11.6rem;
  `}
`;

const StyledImage = styled.img`
display: flex;
  max-width: 80%;
  max-height: 100%;
  //object-fit: contain; // 이미지 비율을 유지하면서 컨테이너에 맞춰 조정
   ${theme.media.mobile`
    font-size: 0.9rem;
    max-height: 11.6rem;
  `}
  //border: 1px solid #E0E1E9
`;

const StyledImage1 = styled.img`
display: flex;
width: 70%;
position: absolute;
top: 10%;
left: 13%;
//height: 80%;
  max-width: 80%;
  max-height: 80%;
  object-fit: contain; // 이미지 비율을 유지하면서 컨테이너에 맞춰 조정
   ${theme.media.mobile`
    font-size: 0.9rem;
    max-height: 11.6rem;
  `}
  //border: 1px solid #E0E1E9
`;

// 마지막 페이지에 배경 이미지 삽입
const TotalImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 30rem;
  min-width: 80%;
  background-image: url(${listMy}); // 배경 이미지 설정
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 8px;
  position: relative;

  ${theme.media.mobile`
    max-height: 11.6rem;
  `}
`;


const ErrorMessage = styled.p`
  width: 100%;
  color: #A49EE7;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  font-weight: 200;
  text-align: left;
`;

const DrawResult = styled.div`
  margin: 2.5rem;
  display: flex;
  width: 80%;
  justify-content: center;
  align-items: center;
  /* border: 1px solid #E0E1E9; */
  position: relative;
  ${theme.media.mobile`
    width:100%;
    max-height: 12rem;
    margin: 0;
    padding: 1rem 0.6rem;
  `}
`;

// const AnalysisResult = styled.div`
//   margin-top: 1rem;
//   font-size: 1rem;
//   color: #3F4045;
// `;

const SaveButton = styled.button`
  width:3rem;
  background-color: #6487e2;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-left:1.2rem;
  &:hover {
    background-color: #5371c9;
  }
  ${theme.media.mobile} {
    padding: 0.5rem 2rem; 
    font-size: 0.2rem; 
  }

`;

const ButtonBox = styled.div`
  display: flex;
  gap: 3.125rem; /* 버튼 간격 */
  justify-content: center;
  align-items: center;
  margin-top: 3.25rem;
  margin-bottom:2.5rem;
  ${theme.media.mobile`
  flex-direction:column;
  `}
`;

const MyPageButtonBox = styled.div`
  width: 10rem;
  height: 2.75rem;
  padding: 0 1.25rem;
  border-radius: 0.25rem;
  border: 0.0625rem solid #9386E0;
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.media.mobile`
  width:80%;
  margin-top:-1.875rem;
  `}
`;

const MyPageButton = styled.div`
  width: 7.5rem;
  text-align: center;
  color: #9386E0;
  font-size: 0.9rem;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 1.5rem;
  word-wrap: break-word;
  cursor: pointer;

`;

const MainButton = styled.div`
  width: 7.5rem;
  text-align: center;
  color: white;
  font-size: 0.9rem;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 1.5rem;
  word-wrap: break-word;
  cursor: pointer;
  
`;

const MainButtonBox = styled.div`
  width: 10rem;
  height: 2.75rem;
  padding: 0 1.25rem;
  background: #9386E0;
  border-radius: 0.25rem;
  border: 0.0625rem solid #9386E0;
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.media.mobile`
  width:80%;
  `}
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  gap: 10%;
  ${theme.media.mobile`
      width: auto;
  `}
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 5%;
  ${theme.media.mobile`
      display: none;
  `}
`;

const LookContainer = styled.div`
  display: flex;
  width: auto;
  padding: 2px 12px 2px 6px;
  background-color: #DDDDF7;
  border-radius: 40px;
  align-items: center;
  font-size: 16px;
  
`;

const LookImg = styled.img`
  
`;

const NextBtn = styled.div`
  display: flex;
  width: 3rem;
  position: absolute;
  right: 2%;
  top: 50%;
  ${theme.media.mobile`
      width: 2rem;
      height: 2rem;
  `}
`;

const ImageNext = styled.div`
  display: flex;
  width: 3rem;
  height: 3rem;
  background-color: #9386E0;
  border-radius: 100%;
  color: white;
`;

const NextL = styled.div` // 오른쪽 버튼
  display: flex;
  width: 3rem;
  position: absolute;
  left: 2%;
  top: 50%;
  ${theme.media.mobile`
      width: 2rem;
      height: 2rem;
  `}
`;

const ListContainer = styled.div`
  display: flex;
  width: 20%;
  gap: 15%;
  justify-content: center;
  ${theme.media.mobile`
      width: 40%;
      gap: 10%;
  `}
`;

const List = styled.div`
  display: flex;
  width: 0.8rem;
  height: 0.8rem;
  background-color: ${({ isActive }) => (isActive ? '#9386E0' : '#E0E1E9')};
  border-radius: 100%;
   ${theme.media.mobile`
      width: 0.5rem;
      height: 0.5rem;
  `}
`;

const Title = styled.h1`
  display: flex;
  width: auto;
  font-size: 26px;

  ${theme.media.mobile`
    font-size: 18px;
  `}
`;