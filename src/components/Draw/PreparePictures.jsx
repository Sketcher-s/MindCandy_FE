import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Check } from '../../assets/Draw/Check.svg';
import { theme } from '../../theme';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/recoilState';

// imgFile props에 대한 유효성 검사를 추가
PreparePicture.propTypes = {

  // imgFile은 File 객체로 전달되어야 합니다.
  imgFile: PropTypes.instanceOf(File),
  
};

function PreparePicture() {

  //페이지 이동 부분
  const Navigate = useNavigate();
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if(!isLoggedIn){
    Navigate('/');
  }

  function handleButtonClick() {
    Navigate('/inputpicture');
  }




  return (
    <Container>
        <Section>
          <Content>
            <SubTitle>그림판 검사 안내사항</SubTitle>
              <NoteContainer>
              <Title>검사 안내</Title>
                <PreContainer>
                <Preparation>
                  <Check />
                </Preparation>
                <Text>본 검사는 그림을 잘 그리거나 못 그리는 것을 평가하지 않습니다.
                    <br />
                    따라서 아이가 편안한 마음으로 그릴 수 있도록 격려해 주세요.</Text>
                </PreContainer>
                <PreContainer>
                <Preparation>
                  <Check />
                </Preparation>
                <Text>4개의 그림판에 집, 나무, 남자 사람, 여자 사람을 각각 그려 4개의 그림을 완성해주세요.</Text>
                </PreContainer>
              </NoteContainer>
              <NoteContainer>
              <Title>그림판 안내사항</Title>
                <PreContainer>
                <Preparation>
                  <Check />
                </Preparation>
                <Text>검정색 이외의 색상은 지원하지 않습니다.</Text>
                </PreContainer>
                <PreContainer>
                <Preparation>
                  <Check />
                </Preparation>
                <Text>그리기 도구, 지우기 도구, 전체 지우기 도구를 제공하니 필요에 따라 적절한 도구를 
                      <br/>선택해주세요.</Text>
                </PreContainer>
              </NoteContainer>
              <ButtonContainer>
                <ButtonWrapper>
                  <ButtonText onClick={handleButtonClick}>
                    검사 시작하기
                  </ButtonText>
                </ButtonWrapper>
              </ButtonContainer>
          </Content>
        {/* 첨부한 이미지 파일을 보여줌 */}
        {/* {imgFile && (
          <div>
            <img src={URL.createObjectURL(imgFile)} alt="Selected Image" width="200" height="200" />
          </div>
        )} */}
        </Section>
      
      </Container>
          )
}

export default PreparePicture;

const Container = styled.div`

  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.875rem; //30px;
  display: flex;
  background: white;
  overflow: auto;
  ${theme.media.mobile`
  height: 93vh;
`}

  ${theme.media.desktop`
  height: 93vh;

`}
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem; //20px;
  height: 100%;
  justify-content: flex-start;

  ${theme.media.mobile`

  
`}
`;

const Title = styled.div`
    color: black;
    font-family: Pretendard-Regular;
    font-size: 1rem; //16px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 24px */
    margin-bottom: 1.25rem;

  ${theme.media.mobile`
    font-size: 0.875rem;
`}
`;

const SubTitle = styled.div`
  color: #27282B;
  font-size: 1.375rem; //22px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 2.0625rem; //33px;
  word-wrap: break-word;
  text-align: center;
  align-self: flex-start;
  padding-left: 1rem;
  margin-top: 2.5rem;

  ${theme.media.mobile`
    font-size: 1.125rem;
`}
`;

const Content = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem; //16px;
  display: flex;
  height: 80%;
  
  ${theme.media.mobile`
    
`}
`;

const Text = styled.div`
  color: #27282b;
  font-size: 1rem; //16px;
  font-family: Pretendard;
  font-weight: 500;
  line-height: 1.5rem; //24px;
  word-wrap: break-word;

  ${theme.media.mobile`
    font-size: 0.875rem;
    text-align: left;
`}
`;

const Text1 = styled.div`
    color: var(--Gray-4, #85878D);
    font-family: Pretendard;
    font-size: 0.875rem; //14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 21px */

  ${theme.media.mobile`
    font-size: 0.875rem;
    text-align: left;
`}
`;

const PreContainer = styled.div`
  justify-content: flex-start;
  gap: 1.25rem; //20px;
  display: flex;
  margin-bottom: 1.25rem;

  ${theme.media.mobile`
  align-items: flex-start;
`}
`;

const NoteContainer = styled.div`
  background: white;
  border-radius: 0.625rem;
  border: 0.0625rem #e0e1e9 solid;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;
  display: flex;
  

  ${theme.media.mobile`
    width: 75%;
    padding: 1.8rem 1.3rem;
  `}

  ${theme.media.desktop`
    width: 40.5rem;
    padding: 1.875rem 2rem;
  `}
`;

const Preparation = styled.div`
  justify-content: center;
//   align-items: center;
  display: flex;

  ${theme.media.mobile`
  padding-top: 0.3rem;
`}
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1.5rem;
`;

const ButtonWrapper = styled.button`
  background: #9386E0;
  border-radius: 0.25rem; //4px;
  justify-content: center;
  align-items: center;
  display: flex;
  border: none;
  cursor: pointer;

  ${theme.media.mobile`
    width: 75%;
`}

  ${theme.media.desktop`
   width: 30%;
  `}
`;

const ButtonText = styled.h1`
  width: 7.5rem; //120px;
  text-align: center;
  color: white;
  font-size: 1rem; //16px;
  font-family: Pretendard;
  font-weight: 700;
  line-height: 1.5rem; //24px;
  word-wrap: break-word;
`;
