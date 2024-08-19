import React from "react";
import { Container, HeaderWrapper, Header, LogoContainer, HeaderButtons, Button, Text, Divider } from './NavbarStyle';
import { useNavigate } from "react-router-dom";
import {ReactComponent as MindCandyLogo} from '../../assets/Navbar/MindCandyLogo.svg';

const NavbarNoMember = () => {
  const navigate = useNavigate();
  const moveToLogin = () => {
    navigate('/login');
  };
  const moveToRegister = () => {
    navigate('/register');
  }
  const moveToMain = () => {
    navigate('/');
  }
  return (
    <Container>
      <HeaderWrapper>
        <Header>
          <LogoContainer onClick={moveToMain}>
            <MindCandyLogo/>
          </LogoContainer>
            <HeaderButtons>
            <Button width={52} issignup={false} onClick={moveToLogin}>
              <Text>로그인</Text>
            </Button>
            <Button width={62} issignup={true} onClick={moveToRegister}>
              <Text>회원가입</Text>
            </Button>
          </HeaderButtons>
        </Header>
      </HeaderWrapper>
      <Divider />
    </Container>
  );
};

export default NavbarNoMember;
