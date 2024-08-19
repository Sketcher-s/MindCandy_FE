import { Container, HeaderWrapper, Header, HeaderButtons, Button, Text, Divider, LogoContainer } from './NavbarStyle';
import React from 'react';
import { useMediaQuery } from "react-responsive";
import { FiMenu } from "react-icons/fi";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {ReactComponent as MindCandyLogo} from '../../assets/Navbar/MindCandyLogo.svg';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/recoilState';

const NavbarMember = ({toggleSidebar}) => {
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  const isMobile = useMediaQuery({maxWidth: 767});
  const navigate= useNavigate();
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
    setIsLoggedIn(false); // 로그인 상태(로그아웃)
    moveToMain(); // main 화면으로 이동
  }
  // 로고 클릭 시 메인으로 이동
  const moveToMain = () => {
    navigate('/');
  }
  return (
    <Container>
      <Header>
          <LogoContainer onClick={moveToMain}>
            <MindCandyLogo/>
          </LogoContainer>
          {isMobile ? (
            <FiMenu size="20" color="#5678BE" onClick={toggleSidebar}/>
          ) : (
            <HeaderButtons>
            <Button width={62} background="#6487E2" border="1px #6487E2 solid" noMember onClick={moveToReady}>
              <Text color="white">검사하기</Text>
            </Button>
            <Button width={72} background="white" border="1px #6487E2 solid" noMember onClick={moveToMy}>
              <Text color="#6487E2">마이페이지</Text>
            </Button>
            <Button width={62} background="white" noMember onClick={handleLogout}> 
              <Text color="#6487E2">로그아웃</Text>
            </Button>
          </HeaderButtons>
          )}
        </Header>
      <Divider />
    </Container>
  );
};

export default NavbarMember;

NavbarMember.propTypes = {
  toggleSidebar: PropTypes.bool.isRequired, // width prop이 숫자 타입이며 반드시 필요함을 명시
};
