import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { theme } from "../theme";
import PropTypes from 'prop-types'; 

// 모달 컨테이너
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

// 모달 내부 래퍼
const ModalWrapper = styled.div`
position: relative; // 상대 위치 기준 추가
  background: white;
  border-radius: 0.25rem; // 4px to rem
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20rem;
  padding: 2.5rem;
  gap: 1.875rem;

  ${theme.media.mobile`
    width: 16rem;
    padding: 1.5rem;
    gap: 1rem;
  `}
`;

// 텍스트 스타일
const Text = styled.div`
  max-width: 19.375rem; // 310px to rem
  text-align: center;
  color: #27282B;
  font-family: 'Pretendard';
  font-weight: 700;
  line-height: 1.5rem; // 24px to rem
  font-size: 1rem;

  ${theme.media.mobile`
    font-size: 0.8rem;
  `}
`;

// 버튼 래퍼
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  gap:1rem;
`;

// 버튼 스타일
const Button = styled.button`
  width: 10rem; // 160px to rem
  height: 2.75rem; // 44px to rem
  padding-left: 1.25rem; // 20px to rem
  padding-right: 1.25rem; // 20px to rem
  background: #9386E0;
  border-radius: 0.25rem; // 4px to rem
  color: white;
  justify-content: center;
  border: none;
  cursor: pointer;
`;

// 닫기 버튼 스타일
const CloseButton = styled.button`
position: absolute;
top: 10px;     // 버튼을 상단으로부터 10px 위치에 배치
right: 10px;   // 버튼을 우측으로부터 10px 위치에 배치
background: transparent;
border: none;
color: #9386E0;
font-size: 1.5rem;
cursor: pointer;
`;

const MainModal = ({ close }) => {  // close 함수를 props로 받음
    const navigate = useNavigate();
  
    return (
      <ModalContainer>
        <ModalWrapper>
          <Text>로그인 또는 회원가입이 필요합니다.</Text>
          <CloseButton onClick={close}>&times;</CloseButton>
          <ButtonWrapper>
            <Button onClick={() => navigate('/login')}>로그인</Button>
            <Button onClick={() => {
              navigate('/register');
            }}>회원가입</Button>
          </ButtonWrapper>
        </ModalWrapper>
      </ModalContainer>
    );
  };
  MainModal.propTypes = {
    close: PropTypes.func.isRequired, 
  };
  export default MainModal;
