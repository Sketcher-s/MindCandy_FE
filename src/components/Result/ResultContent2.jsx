import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
import {theme} from '../../theme';
import { useLocation } from 'react-router-dom';

function ResultContent() {
  const [analysisResult, setAnalysisResult] = useState("");
  const location = useLocation();
  const [isOpen, setIsOpen] = useState({
    htp: false,
    analysis: false
  });
  const [results, setResults] = useState({
    home: '',
    tree: '',
    person: '',
    summary: ''
  });
  const toggleSection = section => {
    setIsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };
  const jwtToken = localStorage.getItem('jwtToken');  // 로컬 스토리지에서 토큰을 가져옵니다.
  const pictureId = location.state?.response?.pictureDto?.id;

  useEffect(() => {
    const fetchPictureDetails = async () => {
      if (!jwtToken) {
        console.error('Authentication token is not available');
        alert('로그인이 필요합니다.');
        return;  // 토큰이 없으면 함수를 더 이상 진행하지 않습니다.
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
          setAnalysisResult(responseData.pictureDto.result);
          const parsedResults = parseResults(responseData.pictureDto.result);
          setResults(parsedResults);
        } else {
          throw new Error('No valid response data');
        }
      } catch (error) {
        console.error('데이터받아오는거 결과값', error);  // 오류 로깅
      }
    };
    fetchPictureDetails();
  }, [jwtToken, pictureId]);  // 의존성 배열에 jwtToken과 pictureId 추가
  
  function parseResults(text) {
    const home = text.match(/\[집\]\s*([^[]*)/)?.[1].trim() || "집 정보 없음";
    const tree = text.match(/\[나무\]\s*([^[]*)/)?.[1].trim() || "나무 정보 없음";
    const person = text.match(/\[사람\]\s*([^[]*)/)?.[1].trim() || "사람 정보 없음";
    const summary = text.match(/\[종합\]\s*([^[]*)/)?.[1].trim() || "종합 정보 없음";
    const result = { home, tree, person, summary };
    return result;
}

  
  return (
    <div>
        <Resultcontent>
          <Content>
        <DetailsSection>
          <SectionTitle>집</SectionTitle>
          <SectionContent>{results?.home}</SectionContent>
        </DetailsSection>
        <DetailsSection>
          <SectionTitle>나무</SectionTitle>
          <SectionContent>{results?.tree}</SectionContent>
        </DetailsSection>
        <DetailsSection>
          <SectionTitle>사람</SectionTitle>
          <SectionContent>{results?.person}</SectionContent>
        </DetailsSection>
        <DetailsSection>
          <SectionTitle>종합</SectionTitle>
          <SectionContent>{results?.summary}</SectionContent>
        </DetailsSection>
      </Content>
      
        <Accordion>
          <AccordionHeader onClick={() => toggleSection('htp')}>
            HTP 그림 검사 유의사항
            <Icon isOpen={isOpen.htp} />
          </AccordionHeader>
          <AccordionBody isOpen={isOpen.htp}>
          HTP 그림 심리 검사는 개인의 심리 상태를 탐색하고 이해하는 데 중요한 도구입니다. 그러나 이 검사 결과에만 의존하기보다는, 다양한 접근을 통해 마음을 이해하려는 노력도 함께해 주시기 바랍니다. 아이의 마음을 더 깊이 이해하기 위해서는 시간을 두고 여러 차례에 걸쳐 검사를 해보는 것이 좋습니다
          </AccordionBody>
          </Accordion>
      <Accordion>
        <AccordionHeader onClick={() => toggleSection('analysis')}>
          검사 결과 이용에 대한 안내
          <Icon isOpen={isOpen.analysis} />
        </AccordionHeader>
        <AccordionBody isOpen={isOpen.analysis}>
        검사를 통해 얻은 결과는 오직 AI 모델 학습에만 사용됩니다. 여러분의 개인 데이터는 이외의 어떠한 목적으로도 사용되지 않음을 약속드립니다.
        </AccordionBody>
      </Accordion>
        </Resultcontent>
    </div>
  );
}
export default ResultContent;


const Resultcontent = styled.div`

${theme.media.mobile`

    margin: 0 auto; // 가운데 정렬 추가

`}
`;
const ContentTitle = styled.p`
font-size: 1rem;
font-weight: 700;
line-height: 1.5rem;
text-align: left;
color:#6487E2;

  ${theme.media.mobile`
 
  `}
`;
const Content = styled.p`
  width: 100%;
  padding-bottom:1.25rem;
  font-family: Pretendard;
  text-align: justified;
  color:#3F4045;  
  ${theme.media.mobile`

  
  `}

`
const Accordion = styled.div`
  width: 100%;
  border: 0.0625rem solid #C3C1F1;
  border-radius:0.625rem;
  margin-bottom:1.25rem;
  ${theme.media.mobile`
   


  `}
`;
const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.625rem 1.25rem 1.625rem;
  color:#4D4F56;
  font-family: Pretendard;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.5rem;
  text-align: left;

`;

const Icon = styled.span`
  border: solid #96B5F3;
  border-width: 0 0.125rem 0.125rem 0;
  padding: 0.1875rem;
  transform: ${props => props.isOpen ? 'rotate(-135deg)' : 'rotate(45deg)'};
  cursor: pointer;
`;

const AccordionBody = styled.div`
  padding: 1.25rem 1.625rem;
  font-size: 0.875rem;
  color: #666;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DetailsSection = styled.div`

  ${theme.media.mobile` 

  `}
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  color: #333;

  ${theme.media.mobile`  // 모바일에서는 글자 크기를 조금 줄임
    font-size: 0.9rem;

  `}
`;

const SectionContent = styled.p`
  font-size: 0.9rem;
  color: #666;
font-family: Pretendard;
font-weight: 600;
text-align: justified; 
align-items: center;
 
  ${theme.media.mobile`  // 모바일에서는 글자 크기를 조금 줄임
    font-size: 0.8rem;
  `}
`;