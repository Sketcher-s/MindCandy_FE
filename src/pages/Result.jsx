import ResultButton from '../components/Result/ResultButton';
import ResultContent from '../components/Result/ResultContent';
import { theme } from '../theme';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation ,useNavigate} from 'react-router-dom';
import home from "../assets/Result/Home.svg";
import tree from "../assets/Result/tree.svg";
import man from "../assets/Result/Man.svg";
import woman from "../assets/Result/Woman.svg";

function Result() {
  const location = useLocation();
  const Navigate = useNavigate();
  const [title, setTitle] = useState(location.state?.response?.pictureDto?.title); // 초기값은 이름을 입력해주세요. 마이페이지에서 왔으면, title 값 유지하고 있어야 함
  const [id ,setId] = useState(0);
  const [image, setImage] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');
  const isFromMyPage = location.state?.response?.fromMyPage ?? false;
  const [isEditing, setIsEditing] = useState(!isFromMyPage);  
  const jwtToken = localStorage.getItem('jwtToken');  // 로컬 스토리지에서 토큰을 가져옵니다.
  const pictureId = location.state?.response?.pictureDto?.id;
  const [canSave, setCanSave] = useState(false);

   const handleMyPageClick = async () => {
    if (!title || title.length > 15) {
      alert('제목은 필수이며, 15자를 넘지 말아주세요.');
    } else {
      Navigate('/mypage', { state: { id, title } });
    }
    if (!jwtToken) {
      console.error('토큰오류임');
      return;
    }
    try {
      const response = await fetch(`https://dev.catchmind.shop/api/picture/title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ id: pictureId, title: title })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating title:', error);
  }
}
  function handleMainClick() {
    Navigate('/');
    window.scrollTo(0, 0);
  }
  useEffect(() => {
    console.log("fromePage",location.state?.fromMyPage);
    console.log(location.state); // 전체 state 로깅
    if (location.state?.fromMyPage) {
      setIsEditing(false);  // 마이페이지에서 온 경우
    } else {
      setIsEditing(true);  // 다른 경우 (기본 설정)
    }
  }, [location.state]);

  
  // useEffect(() => {
  //   validateTitle(title);  // 초기 렌더링 시 제목의 유효성을 검사합니다.
  // }, []);  // 의존성 배열을 비워 컴포넌트 마운트 시 한 번만 실행되도록 합니다.
  
  useEffect(() => {
    const fetchPictureDetails = async () => {
      if (!jwtToken) {
        console.error('Authentication token is not available');
        return;  
      }
      try {
        const response = await fetch(`https://dev.catchmind.shop/api/picture/${pictureId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`  // 헤더에 토큰을 포함시킵니다.
          }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const responseData = await response.json();
        if (responseData && responseData.pictureDto) {
          setImage(responseData.pictureDto.imageUrl);
          console.log('Get response:', responseData);  // 성공 응답 로깅
        } else {
          throw new Error('No valid response data');
        }
      } catch (error) {
        console.error('데이터받아오는거 결과값', error);  // 오류 로깅
      }
    };
  
    fetchPictureDetails();
  }, [jwtToken, pictureId,location.state]);  // 의존성 배열에 jwtToken과 pictureId 추가
  const handleTitleChange = (event) => {
      setTitle(event.target.value);
      validateTitle(event.target.value);
  };

  const validateTitle = (inputTitle) => {
    if (inputTitle.length > 15) {
        setError('제목은 15자를 넘지 말아주세요.');
        setCanSave(false);
    } else if (!inputTitle) {
        setError('제목을 입력해주세요.');
        setCanSave(false);
    } else {
        setError('');
        setCanSave(true);
    }
  };
  

  const handleSave = async () => {
    if (!jwtToken) {
      console.error('토큰오류임');
      return;
    }
    try {
      const response = await fetch(`https://dev.catchmind.shop/api/picture/title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ id: pictureId, title: title })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating title:', error);
    }
    setIsEditing(false);
};

  const handleEdit = async () => {
    setIsEditing(true);  // 편집 모드 종료
  };
  
  return (
    <div>
      <Wrapper>
        <DrawingSection>
          <TopContainer>
            <LookContainer><LookImg src={home}/>집</LookContainer>
            <LookContainer><LookImg src={tree}/>나무</LookContainer>
            <LookContainer><LookImg src={man}/>남자 사람</LookContainer>
            <LookContainer><LookImg src={woman}/>여자 사람</LookContainer>
          </TopContainer>
            <DrawResult>
              {image && <StyledImage src={image} alt="Drawing for Analysis" />}
            </DrawResult>
              <TitleSection>
                <TitleInput
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="그림의 제목을 입력하세요"
                    readOnly={!isEditing}
                    isError={error.length > 0}
                />
              </TitleSection>
              {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <AnalysisResult>{analysisResult}</AnalysisResult>
      
          <ResultContent/>
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
    </div>
  );
}
export default Result;

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
  width: 60%; // 기본 화면에서의 너비

  `}
`;
const TitleSection = styled.div`
  display: flex;
  width: 100%;
`;

// const ResultSection = styled.div`
//   width: 100%;
// `;

const TitleInput = styled.input`
  width: 90%;
  height: 1.875rem;
  font-size: 1.625rem;
  font-weight: bold;
  border: none;
  border-bottom: 0.125rem solid transparent;
  &:focus {
    outline: none;
    border-bottom: 0.125rem solid #6487e2;
  }
  border-bottom-color: ${props => props.isError ? 'red' : 'transparent'};
  &::placeholder {
    color: rgb(177, 178, 184);
    ${theme.media.mobile`
      font-size: 0.9rem;
    `}
  }
  ${theme.media.mobile`
    width:80%;
    font-size: 0.9rem;
  `}
`;
const StyledImage = styled.img`
  width: 75%;
  height: 80%;
  border: 1px solid #E0E1E9
  ${theme.media.mobile`
  width:100%;
  height: 100%;
`}

`;
const ErrorMessage = styled.p`
  color: red;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  font-weight: 200;
`;

const DrawResult = styled.div`
  margin: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #E0E1E9
  ${theme.media.mobile`
    width:90%;
  `}
`;

const AnalysisResult = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #3F4045;
`;

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
  width: 40%;
  gap: 10%;
  ${theme.media.mobile`
      
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