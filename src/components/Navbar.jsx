import { Container, HeaderWrapper, Header, HeaderTitle, HeaderButtons, Button, Text, Divider } from './NavbarStyle';

const Navbar = () => {
  return (
    <Container>
      <HeaderWrapper>
        <Header>
          <HeaderTitle>Catch Mind</HeaderTitle>
          <HeaderButtons>
            <Button width={52} issignup={false}>
              <Text>로그인</Text>
            </Button>
            <Button width={62} issignup={true}>
              <Text>회원가입</Text>
            </Button>
          </HeaderButtons>
        </Header>
      </HeaderWrapper>
      <Divider />
    </Container>
  );
};

export default Navbar;