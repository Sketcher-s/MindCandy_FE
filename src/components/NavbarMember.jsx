import React from "react";
import { Container, HeaderWrapper, Header, HeaderTitle, HeaderButtons, Button, Text, Divider } from './NavbarStyle';
import { useMediaQuery } from "react-responsive";
import { FiMenu } from "react-icons/fi";
import PropTypes from 'prop-types';

const NavbarMember = () => {
  
  return (
    <Container>
      <HeaderWrapper>
        <Header>
          <HeaderTitle>Catch Mind</HeaderTitle>
            <HeaderButtons>
            <Button width={52}>
              <Text>로그인</Text>
            </Button>
            <Button width={62}>
              <Text>회원가입</Text>
            </Button>
          </HeaderButtons>
        </Header>
      </HeaderWrapper>
      <Divider />
    </Container>
  );
};

export default NavbarMember;
