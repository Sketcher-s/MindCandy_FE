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
    Navigate('/draw');
  }

  function handlePicClick() {
    Navigate('/preparepicture');
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
                <NoteText>각자 상황에 맞는 테스트 방식을 선택해주세요.</NoteText>
            </SubContainer>
          <ButtonBox>
            <PicButtonBox onClick={handlePicClick}>
              <PicButton>종이 그림 검사</PicButton>
            </PicButtonBox>
            <DraButtonBox onClick={handleDrawClick}>
              <DraButton>그림판 검사</DraButton>
            </DraButtonBox>
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
  //border-radius: 0.625rem; //10px;

  ${theme.media.mobile`
`}

`;

const InnerContainer = styled.div`
  width: 40.25rem; //644px;
  height: 29.813rem; //477px;
  padding-top: 2.5rem; //40px;
  padding-bottom: 2.5rem; //40px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  
  display: flex;
  background: white;
  border-radius: 0.625rem; //10px;

  ${theme.media.mobile`
  padding: 2rem 1rem;
  width: 80%;
  height: 75%;
`}
`;

const InnerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  //gap: 1.5rem; //30px;
  ${theme.media.mobile`
  justify-content: flex-start;
  align-items: center;
  
`}
`;

const SubContainer = styled.div`
  //flex-direction: column;
  justify-content: flex-start;
  //align-items: center;
  gap: 1.25rem; //20px;
  display: flex;

  ${theme.media.mobile`
  // justify-content: center;
  // display: flex-direction: column;
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
    //width: 18rem; 
  `}
`;

const Text = styled.div`
  color: #27282b;
  font-size: 1.625rem; //26px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 2.4375rem; //39px;
  word-wrap: break-word;

  ${theme.media.mobile`
  font-size: 1.375rem;
  `}
`;

const SubText = styled.div`
  color: #27282b;
  font-size: 0.875rem; //14px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 2.4375rem; //39px;
  word-wrap: break-word;

  ${theme.media.mobile`
  font-size: 1.375rem;
  `}
`;

const NoteContainer = styled.div`
  //width: 30.25rem; //484px;
  //height: 40%; //266px;
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
  //height: 50%;
  border: none;
  padding: 0;
  //align-items: center;
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
  // justifyContent: flex-start;
  // alignItems: flex-start;
  // gap: 50px;
  // display: inline-flex;
  display: flex;
  gap: 1.25rem; //20px; /* 버튼 간격 */

  ${theme.media.mobile`
  height: 3rem;
  display: block;
  gap: 2.5rem;
`}


`;

const PicButtonBox = styled.div`
  width: 10rem; //160px;
  height: 2.75rem; //44px;
  padding: 0 1.25rem; //0 20px;
  background: white;
  border-radius: 0.25rem; //4px;
  border: 0.0625rem solid #9386E0;
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.media.mobile`
 
  // width: 15.625rem;
  width: 15.625rem;
  height: 2.5rem;
  padding: 0 1.25rem;
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
  width: 10rem; //160px;
  height: 2.75rem; //44px;
  padding: 0 1.25rem; //0 20px;
  background: #9386E0;
  border-radius: 0.25rem; //4px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.media.mobile`
  margin-top: 1.25rem;
  width: 15.625rem;
  height: 2.5rem;
  padding: 0 1.25rem;
`}

`;