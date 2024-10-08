import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import MainModal from '../components/MainModal';  // Modal 컴포넌트의 경로를 확인하고 적절히 수정하세요.
import { ReactComponent as mainDraw } from '../assets/Main/mainDraw.svg';
import { ReactComponent as Main2 } from  '../assets/Main/Main2.svg';
import { ReactComponent as Main3 } from  '../assets/Main/Main3.svg';
import { theme } from '../theme';
import { ButtonWrapper } from '../components/Login/LoginStyle';
import mainPicture1 from "../assets/Main/mainPicture1.svg";
//import mainDraw from "../assets/Main/mainDraw.svg";

const StyledMain1 = styled(mainDraw)`
  width: ${props => props.width || '90%'};
  height: ${props => props.height || '22.4475rem'};
  ${theme.media.mobile`
    margin-top: -2rem; 
    margin-left:1rem;
  `}
`;

const StyledMain3 = styled(Main3)`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 'auto'};
`;

const StyledMain = styled.img`
  width: 100%;
`;
 

function Main() {
  const Navigate = useNavigate(); 
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('jwtToken'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') { // 메인 페이지로 이동했을 경우에만 스크롤을 최상단으로 이동
      window.scrollTo(0, 0);
    }
  }, [location.pathname]); // location.pathname을 의존성 배열에 추가
  
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  function handleDrawClick() {
    if (isLoggedIn) {
      Navigate('/preparePage'); 
    } else {
      setIsModalOpen(true);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  return (
    <MainContainer>
      <InspectionSection>
        <InspectionContent>
          <InspectionTitle>HTP 그림 검사 결과</InspectionTitle>
          <InspectionDescription>아이의 내면을 탐험하고,<br/> 건강한 정신 발달을 지원하세요!</InspectionDescription>
          <DrawButton onClick={handleDrawClick}>검사하기</DrawButton>
        </InspectionContent>
        <ImgBox><StyledMain1 /></ImgBox>
      </InspectionSection>
        <Section>
          <MindSection>
            <ImgBox><StyledMain src={mainPicture1}/></ImgBox>
            <MindContent>
                <MindTitle>아이의 마음, <Highlighted>그림</Highlighted>으로 알아보아요</MindTitle>
                <MindDescription>HTP 그림 심리 검사를 통해<br/> 
                아이의 심리 상태를 파악하는데 도움을 받아보세요.</MindDescription>
            </MindContent>
          </MindSection>
          <ResultsSection>
            <ResultsContent>
              <ResultsTitle>HTP 그림 심리 검사란?</ResultsTitle>
              <ResultsDescription>아동이 그린 집, 나무, 남자와 여자를 바탕으로 <br/>심리 상태를 분석하는 방법입니다.</ResultsDescription>
              <ResultsDescription>아동의 그림을 통해 형식 분석과 내용 분석을 진행하고, <br/>그림의 크기, 위치, 세밀함 등 다양한 요소를 평가합니다. <br/>HTP 그림 심리 검사를 통해 <br/>아동의 자신감, 감정 상태, 대인 관계 태도 등을 파악할 수 있습니다.</ResultsDescription>
            </ResultsContent>
            <ImgBox><StyledMain3/></ImgBox>
          </ResultsSection>
          </Section>  
          <Footer>
          <FooterBox>
            <FooterTitle>
              CatchMind에서는 이렇게 검사해요!
            </FooterTitle>
            <FooterContent dangerouslySetInnerHTML={{ __html: isMobile ? 
      "예상 검사 소요 시간은 20분이며,<br/>만 18세 미만의 청소년 및 아동의 그림으로 <br/> 심리 검사가 진행됩니다.<br/>비용은 발생하지 않습니다." : 
      "예상 검사 소요 시간은 20분이며,<br/>만 18세 미만의 청소년 및 아동의 그림으로 심리 검사가 진행됩니다.<br/>비용은 발생하지 않습니다." }} />

          </FooterBox>
        </Footer>
        {isModalOpen && <MainModal close={closeModal} />}
      </MainContainer>
  );
}

export default Main;

const MainContainer = styled.div`
//overflow-y: auto;
height: 100vh; // 뷰포트의 전체 높이
`;

const InspectionSection = styled.div`
  display: flex;
  background: #f3f3f6;
  flex-direction:row;
  align-items: center;
  justify-content: center;
  ${theme.media.mobile`
    flex-direction:column;
    position:relative;
    margin-bottom:5rem;
  `}
`;

const InspectionContent = styled.div`
  margin : 3rem;
  align-items: center;
  ${theme.media.mobile`
    text-align: center;
  `}
`;

const InspectionTitle = styled.h2`
  font-family: Pretendard;
  font-size: 1.125rem;  // 18px
  font-weight: 700;
  line-height: 1.6875rem;  // 27px
  color: #A49EE7;
  ${theme.media.mobile`
    font-size: 1.375rem;
    text-align: center;
  `}
`;

const InspectionDescription = styled.p`
  font-family: Pretendard;
  font-size: 2vw;
  font-weight: 700;
  color:black;
  ${theme.media.mobile`
    font-size: 1.375rem;
    text-align: center;
  `}
`;

const DrawButton = styled.button`
  width: 10rem;
  height: 2.75rem;
  border-radius: 0.25rem;
  background: #9386E0;
  color: white;
  border:none;
  font-weight:700;
  margin-top:20px;
  justify-content: center;
  cursor:pointer;
  ${theme.media.mobile`
    position: absolute;
    bottom:-50px;
    left: 50%;
    transform: translateX(-50%);
  `}
`;

const ImgBox = styled.div``;

const Section = styled.div`
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  padding: 3.25rem;
  background:white;
  ${theme.media.mobile`
    align-items: center;
  `}
`;

const MindSection = styled.div`
  display:flex;
  ${theme.media.mobile`
    display:flex;
    flex-direction:column;
    width: 100%;
    height: 100%;
  `}
`;

const MindContent = styled.div`
  padding: 2.125rem;
  justify-content: center;
  align-items: center;
`;

const MindTitle = styled.h2`
  font-family: Pretendard;
  font-size: 1.375rem;
  font-weight: 700;
  text-align: left;
  color: #27282B;
`;

const Highlighted = styled.span`
  color: #A49EE7;
`;

const MindDescription = styled.p`
  width: 22.5rem;
  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3125rem;
  text-align: left;
  color: #3F4045;
  ${theme.media.mobile`
    width:100%;
  `}
`;

const ResultsSection = styled.div`
  display:flex;
  color:black;
  ${theme.media.mobile`
    flex-direction: column-reverse; // 모바일에서는 열 방향으로 변경하고 순서 반전
    width: 100%;
    height: 100%;
  `}
`;

const ResultsContent = styled.div`
  padding:2.5rem;
  ${theme.media.mobile`
    padding: 0.5rem 1rem;
  `}
`;

const ResultsTitle = styled.h2`
  font-family: Pretendard;
  font-size: 1.375rem;
  font-weight: 700;
  text-align: left;
  ${theme.media.mobile`
  `}
`;

const ResultsDescription = styled.p`
  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3125rem;
  text-align: left;
  color: #3F4045;
  ${theme.media.mobile`
  `}
`;

const Footer = styled.footer`
  width: 100%;
  background: #27282B;
  text-align:center;
  ${theme.media.mobile`
   
  `}
`;

const FooterBox = styled.footer`
  padding:3.5rem;
  text-align:center;
`;

const FooterTitle = styled.div`
  font-size: 1.275rem;
  font-weight: 700;
  line-height: 2.0625rem;
  text-align: center;
  color:white;
  margin-bottom:1.25rem;
  ${theme.media.mobile`
    font-size: 0.8rem;
  `}
`;

const FooterContent = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3125rem;
  text-align: center;
  color:white;
  ${theme.media.mobile`
    font-size: 0.6rem;
  `}
`;
