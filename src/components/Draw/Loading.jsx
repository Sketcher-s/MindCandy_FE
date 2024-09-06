//import React from 'react';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import spinner from '../../assets/Draw/spinner.gif';
import Modal from '../Modal';
import Scan from './Scan';
import { theme } from '../../theme';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/recoilState';


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
      setModalOpen(true); // 12초 후 모달 열기
    }, 16000);

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
    <Spinner src={spinner} alt="로딩중" width="5%" />
    <TexDiv>
    <Text>검사 결과를 기다리고 있어요!</Text>
    </TexDiv>
    <CanvasContainer>
  </CanvasContainer>
    </TContainer>

    
    <Scan sizeH={imageHeight}/>
    {/* 모달을 열기 위한 버튼 */}
    {modalOpen && (
        <Modal
          title="그림 확인이 필요해요 !"
          message="집, 나무, 사람이 제대로 그려졌는지 확인해주세요."
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
  //padding-top: 2.5rem; //40px;
  //padding-bottom: 2.5rem; //40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //gap: 2.5rem; //40px;
  display: flex;
  //background: #f3f3f6;
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
`;

const Spinner = styled.img`
  width: 1.375rem; 
  height: 1.375rem; 
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


const CanvasContainer = styled.div`
  display: flex;
  // width: 20rem; //482px;
  // height: 24.625rem; //482px;

  ${theme.media.mobile`
  width: 70%;
  //height: ${(props) => (props.sizeH)};
  `}

  ${theme.media.desktop`
  width: 40%;
  //height: ${(props) => (props.sizeH)};
  margin-top: 4rem;
  `}
`;

const TexDiv = styled.div`
  // width: 20rem; //482px;
  // height: 24.625rem; //482px;

  ${theme.media.mobile`
  text-align: center;
`}
`;

const ImageData = styled.div`
  
  ${theme.media.mobile`
  text-align: center;
  width: ${(props) => (props.sizeW)};
  height: ${(props) => (props.sizeH)};
`}

  ${theme.media.desktop`
  width: ${(props) => (props.sizeW)};
  height: ${(props) => (props.sizeH)};
`}


`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;