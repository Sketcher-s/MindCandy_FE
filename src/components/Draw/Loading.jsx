import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import { theme } from '../../theme';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/recoilState';
import { ReactComponent as Loading_people } from '../../assets/Draw/Loading_people.svg';
import { ReactComponent as Magnifier } from '../../assets/Draw/Magnifier.svg';


export default function Loading() {

  const [modalOpen, setModalOpen] = useState(false); // 모달의 열림/닫힘 상태를 관리합니다.
 
  const navigate = useNavigate();

  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if(!isLoggedIn){
    navigate('/');
  }

  // 모달을 12초 후에 자동으로 열기
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalOpen(true); // 12초 후 모달 열기 16000초
    }, 1600000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  
  const handleModalOpen = () => {
    setModalOpen(true); // 모달을 열기 위해 상태를 변경하는 함수
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
    navigate('/result'); // 화면 이동 테스트를 위한 코드. 연동 후 삭제하기
  }

  //사진첨부에서 받아온 이미지 불러오기
  const location = useLocation();
  // const imageData = location?.state?.imageData;
  // const imageWidth = location?.state?.width;
  // const imageHeight = location?.state?.height;
  const { imageData, width: imageWidth, height: imageHeight } = location.state || {};

  useEffect(() => {
    if (imageData) {
      const imgElement = document.getElementById('loadedImage');
      if (imgElement) {
        imgElement.src = imageData;
      }
      console.log(imageWidth);
      console.log(imageHeight);
    }
  }, [imageData, imageWidth, imageHeight]);


  return (
  
        
    <OutContainer onClick={handleModalOpen}>

    <TContainer>
    <TexDiv>
    <Text>검사 결과를 기다리고 있어요!</Text>
    </TexDiv>
    <PictureContainer>
    <StyledLoadingPeople/>
    <StyledMagnifier />
    </PictureContainer>
    </TContainer>

    

    {/* 모달을 열기 위한 버튼 */}
    {modalOpen && (
        <Modal
          title="그림 확인이 필요해요!"
          message="그림이 제대로 그려졌는지 확인해주세요."
          close={handleModalClose} // 모달을 닫는 핸들러를 전달
        />
      )}
    </OutContainer>

    

  );
}

Loading.propTypes = {
  imageData: PropTypes.string // imageData의 타입을 문자열로 정의
};

const OutContainer = styled.div`
  width: 100%;
  height: 93vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  background: white;
  position: relative;
  overflow: hidden;
`;

const TContainer = styled.div`
width: 100%;
height: 100%;
padding-top: 5rem; //40px;
flex-direction: column;
justify-content: flex-start;
align-items: center;
gap: 1rem; //14px;
display: flex;

position: relative;
`;

const Text = styled.div`
  width: 21.5rem; //296px;
  height: 2.4375rem; //39px;
  color: #3F4045;
  display: flex;
  justify-content: center;
  font-size: 1.625rem; //26px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 2.4375rem; //39px;
  word-wrap: break-word;

  ${theme.media.mobile`
    font-size: 1.125rem;
    align-items: center;
    justify-content: center;
  `}
`;

const TexDiv = styled.div`

  ${theme.media.mobile`
  text-align: center;
`}
`;

const PictureContainer = styled.div`
  display: flex;
  width: 35rem; //560px;
  height: 24.5rem; //392px;
  justify-content: center;
  align-items: center;
  gap: 1.25rem; //20px;
  border-radius: 0.75rem; //12px;
  border: 1px solid #E0E1E9;
  background: #F3F3F6;
  margin-top: 1.875rem;
    position: relative; // 또는 absolute 등, 필요에 따라

  ${theme.media.mobile`

`}
`;

const StyledLoadingPeople = styled(Loading_people)`
  z-index: 1; // 다른 요소들보다 높은 값
`;

const StyledMagnifier = styled(Magnifier)`
  position: absolute; // 위치 고정 대신 상대적 위치 조정
  z-index: 1000; // 다른 요소보다 위에 위치
  animation: trianglePath 4s infinite;

  @keyframes trianglePath {
    0% {
      transform: translateY(10); // 시작 지점
    }
    33% {
      transform: translateY(60px); // 위로 100px
    }
    46% {
      transform: translate(-80px, 50px); // 오른쪽으로 100px, 위에서 유지
    }
    86% {
      transform: translate(30, 120px); // 오른쪽으로 100px, 위에서 유지
    }
      66% {
      transform: translateY(-60px); // 위로 100px
    }
    100% {
      transform: translate(80px, 0px); // 원래 높이로 내려오면서 오른쪽에서 시작 위치
    }
    120% {
      transform: translate(10); // 원래 높이로 내려오면서 오른쪽에서 시작 위치
    }
  }
`;