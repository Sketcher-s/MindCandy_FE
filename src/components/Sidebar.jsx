import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {IoCloseOutline} from 'react-icons/io5';
import { ReactComponent as User } from '../assets/User/user.svg';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { SidebarState } from '../recoil/recoilState';
import { LoginState } from '../recoil/recoilState';

const Background = styled.div`
position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.show ? 'block' : 'none')};
  z-index: 9;
`;

const SideContainer = styled.div`
position: fixed;
  top: 0;
  right: ${(props) => (props.show ? '0' : '-60%')}; // show가 true일 때 0, 아니면 -250px
  width: 60%;
  height: 100%;
  background: white;
  transition: right 0.3s ease; // 부드러운 전환 효과
  gap: 0.625rem;
  box-shadow: -2px 0 5px rgba(0,0,0,0.5);
  z-index: 10;
`
const InnerContainer = styled.div`
width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem; /* 16px */
  display: flex;
  margin-top: 6rem;
`;

const Content = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.25rem; /* 20px */
  display: flex;
`;

const IconContainer = styled.div`
  justify-content: flex-end;
  align-items: center;
  display: flex;
`;

const Icon = styled.div`
  width: 3.75rem; /* 60px */
  height: 3.75rem; /* 60px */
  background: #F3F3F6;
  border-radius: 9999rem;
  border: 0.1025rem solid #F3F3F6; /* 1.64px */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.div`
  width: 100%; /* 228px */
  height: 0;
  border: 0.0625rem solid #E0E1E9; /* 1px */
`;

const LinkContainer = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.125rem; /* 2px */
  display: flex;
`;

// const Link = styled.div`
//   width: 11.125rem; /* 178px */
//   padding: 0.625rem 0; /* 10px 0 */
//   justify-content: flex-start;
//   align-items: center;
//   gap: 0.625rem; /* 10px */
//   display: inline-flex;
//   color: ${(props) => props.color || '#3F4045'};
//   font-size: 1rem; /* 16px */
//   font-family: 'Pretendard';
//   font-weight: 700;
//   line-height: 1.5rem; /* 24px */
//   word-wrap: break-word;
// `;

const MoveBtn = styled.button`
  width: 11.125rem; /* 178px */
  padding: 0.625rem 0; /* 10px 0 */
  justify-content: flex-start;
  align-items: center;
  gap: 0.625rem; /* 10px */
  display: flex;
  color: ${(props) => props.color || '#3F4045'};
  font-size: 1rem; /* 16px */
  font-family: 'Pretendard';
  font-weight: 700;
  line-height: 1.5rem; /* 24px */
  word-wrap: break-word;
  border: none; /* 버튼의 기본 테두리 제거 */
  background: transparent; /* 버튼의 기본 배경 제거 */
  cursor: pointer; /* 마우스를 올렸을 때 커서 변경 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
`;

const Email = styled.div`
  width: 11.25rem; /* 180px */
  color: #3F4045;
  font-size: 1rem; /* 16px */
  font-family: 'Pretendard';
  font-weight: 600;
  line-height: 1.5rem; /* 24px */
  word-wrap: break-word;
`;

const CloseContainer = styled.div`
position: absolute;
right: 1rem;
top: 3rem;
`;

const Sidebar = () => {
  // sidebar 상태
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(SidebarState);
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);

  const navigate = useNavigate();
    // 검사하기 이동
  const moveToReady = () => {
    navigate('/preparedraw');
  }
  // 마이페이지 이동
  const moveToMy = () => {
    navigate('/mypage');
  }

  // 로그아웃 처리하기
  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // 토큰 삭제
    setIsSidebarOpen(false);
    setIsLoggedIn(false); // 로그인 상태(로그아웃)
    navigate('/'); // main 화면으로 이동
  }
    return (
      <>
      <Background show={isSidebarOpen} onClick={() => (setIsSidebarOpen(false))}/>
        <SideContainer show={isSidebarOpen}>
        <InnerContainer>
          <CloseContainer onClick={() => (setIsSidebarOpen(false))}>
              <IoCloseOutline size='30' color='#97999F'/>
          </CloseContainer>
          <Content>
            <IconContainer>
                <Icon><User/></Icon> 
            </IconContainer>
            <Email>qwer@naver.com</Email>
          </Content>
          
          <Divider />
          <LinkContainer>
            <MoveBtn color="#6487E2" onClick={moveToReady}>검사하기</MoveBtn>
            <MoveBtn onClick={moveToMy}>마이페이지</MoveBtn>
            <MoveBtn onClick={handleLogout}>로그아웃</MoveBtn>
          </LinkContainer>
        </InnerContainer>
      </SideContainer>
      </>
      );
}

export default Sidebar;

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.object,
  };