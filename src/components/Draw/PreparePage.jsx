import React from 'react';
import styled from 'styled-components';
import { ReactComponent as PrepareDraw1 } from '../../assets/Draw/PrepareDraw1.svg'; // vite 사용하여 SVG 파일 import
import { ReactComponent as Check } from '../../assets/Draw/Check.svg';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/recoilState';

const StyledPrepareDraw1 = styled(PrepareDraw1)`
  width: ${props => props.width || '2.5rem'};
  height: ${props => props.height || '2.5rem'};
`;

function PrepareDraw() {
  const Navigate = useNavigate();

  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if(!isLoggedIn){
    Navigate('/');
  }

  function handleDrawClick() {
    Navigate('/preparepicture');
  }

  function handlePicClick() {
    Navigate('/prepareDraw');
  }

  return (
    <OuterContainer>
      <InnerContainer>
        <InnerWrapper>

          <StyledPrepareDraw1 />
          <Text>검사 시작 전 안내사항</Text>
          <SubText>정확한 검사를 위해 다음 안내 사항들을 꼭 지켜주세요!</SubText>

          <NoteContainer>
            <SubContainer>
              <TextContainer>
                <Check />
              </TextContainer>
                <NoteText>
                  아동이 HTP (House-Tree-Person) 테스트를 수행할 때,
                  <br />
                  가능한 한 집, 나무, 사람을 포함하여 그릴 수 있도록 지도해 주세요.
                </NoteText>
            </SubContainer>
            <SubContainer>
              <TextContainer>
                <Check />
              </TextContainer>
                <NoteText>아동이 정서적으로 안정된 상태에서 테스트를 진행하도록 해주세요.</NoteText>
            </SubContainer>
            <SubContainer>
              <TextContainer>
                <Check />
              </TextContainer>
                <NoteText>정확한 검사를 위해 예시 그림은 제공되지 않습니다.</NoteText>
            </SubContainer>
          </NoteContainer>
          <SubContainer>
                <ChoiceText>각자 상황에 맞는 테스트 방식을 선택해주세요.</ChoiceText>
            </SubContainer>
          <ButtonBox>
          <InnerButtonBox>
            <PicButtonBox onClick={handlePicClick}>
              <PicButton>종이 그림 검사</PicButton>
            </PicButtonBox>
              <PicMemo>종이에 그림을 그려 사진을 업로드해요.</PicMemo>
          </InnerButtonBox>
          <InnerButtonBox>
            <DraButtonBox onClick={handleDrawClick}>
              <DraButton>그림판 검사</DraButton>
            </DraButtonBox>
            <DraMemo>마음사탕의 그림판에서 그림을 그려요.</DraMemo>
            </InnerButtonBox>
          </ButtonBox>
        </InnerWrapper>
      </InnerContainer>
      
    </OuterContainer>
    
  );
}

export default PrepareDraw;

// 스타일 컴포넌트 정의
const OuterContainer = styled.div`
  width: 100%;
  height: 93vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.875rem; //30px;
  display: flex;
  background: #f3f3f6;

  ${theme.media.mobile`
`}

`;

const InnerContainer = styled.div`
  width: 40.25rem; //644px;
  height: 29.813rem; //477px;
  padding-top: 2.5rem; //40px;
  padding-bottom: 2.5rem; //40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  display: flex;
  background: white;
  border-radius: 0.625rem; //10px;

  ${theme.media.mobile`
  padding: 2rem 1rem;
  width: 80%;
  height: 70%;

`}
`;

const InnerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  ${theme.media.mobile`
  justify-content: flex-start;
  align-items: center;
  
`}
`;

const SubContainer = styled.div`
  justify-content: flex-start;
  gap: 1.25rem; //20px;
  display: flex;

`;

const ChoiceText = styled.div`
  margin-top: 1.875rem;
  margin-bottom: 1.25rem;
  color: #6146BB;
  text-align: center;
  font-family: Pretendard-Regular;
  font-size: 0.75rem; //14px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 21px */

    ${theme.media.mobile`
      display: none;
  `}
`;

const TextContainer = styled.div`
  // width: 100%;
  // height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.6875rem; //14px;
  display: inline-flex;

  ${theme.media.mobile`
  `}
`;

const Text = styled.div`
  color: #27282b;
  font-size: 1.625rem; //26px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 2.4375rem; //39px;
  word-wrap: break-word;
  margin-top: 1rem; //16px;
  margin-bottom: 0.375rem; //6px;

  ${theme.media.mobile`
    font-size: 0.875rem;
  `}
`;

const SubText = styled.div`
  color: #4D4F56;
  font-size: 0.875rem; //14px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  word-wrap: break-word;
  margin-bottom: 1.25rem; //20px;
  line-height: 150%; /* 21px */

  ${theme.media.mobile`
    font-size: 0.75rem;
  `}

`;

const NoteContainer = styled.div`
  width: 30.938rem; //495px;
  height: 8.25; //132px;
  padding: 1.8rem; //30px;
  background: white;
  border-radius: 0.625rem; //10px;
  border: 0.0625rem #e0e1e9 solid;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.875rem; //14px;
  display: flex;

  ${theme.media.mobile`
  width: 90%;
  border: none;
  padding: 0;
  gap: 0.5rem;
  justify-content: center;

`}
`;

const NoteText = styled.div`
  color: #27282b;
  font-size: 1rem; //16px;
  font-family: Pretendard-Regular;
  font-weight: 500;
  line-height: 1.5rem; //24px;
  word-wrap: break-word;

  ${theme.media.mobile`
  font-size: 0.875rem; 
  margin-top: -1%;
`}

`;

const ButtonBox = styled.div`
  display: flex;
  gap: 1.25rem; //20px; /* 버튼 간격 */
  justify-content: center;
  align-items: center;

  ${theme.media.mobile`
  height: 3rem;
  display: block;
  gap: 2.5rem;

`}


`;

const PicButtonBox = styled.div`
  width: 8rem; //160px;
  height: 2.75rem; //44px;
  padding: 0 1.25rem; //0 20px;
  background: white;
  border-radius: 0.25rem; //4px;
  border: 0.0625rem solid #9386E0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.625rem;
  margin-left: 0.28rem;

  ${theme.media.mobile`

  width: 10rem; //160px;
  height: 2.75rem; //44px;
  padding: 0 1.25rem; //0 20px;
  background: #9386E0;
  border-radius: 0.25rem; //4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
`}


`;

const PicButton = styled.button`
  width: 10rem; //120px;
  text-align: center;
  color: #9386E0;
  font-size: 1rem; //16px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 1.5rem; //24px;
  word-wrap: break-word;
  border: none;
  background: none;
  cursor: pointer;

  ${theme.media.mobile`
  color: white;
`}

`;

const DraButton = styled.button`
  width: 7.5rem; //120px;
  text-align: center;
  color: white;
  font-size: 1rem; //16px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 1.5rem; //24px;
  word-wrap: break-word;
  border: none;
  background: none;
  cursor: pointer;
`;

const DraButtonBox = styled.div`
  width: 8rem; //160px;
  height: 2.75rem; //44px;
  padding: 0 1.25rem; //0 20px;
  background: #9386E0;
  border-radius: 0.25rem; //4px;
  border: 0.0625rem solid #9386E0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.625rem;
  margin-left: 0.16rem;

  ${theme.media.mobile`
    display: none;
`}

`;

const PicMemo = styled.div`
  color: #85878D;
  font-family: Pretendard-Regular;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 18px */

  ${theme.media.mobile`
    text-align: center;
`}

`;

const DraMemo = styled.div`
  color: #85878D;
  font-family: Pretendard-Regular;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 18px */

  ${theme.media.mobile`
    display: none;
`}

`;

const InnerButtonBox = styled.div`


  ${theme.media.mobile`
`}

`;