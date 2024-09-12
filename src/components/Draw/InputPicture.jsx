import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/recoilState';
import DrawModal from './DrawModal';  // 위에서 만든 모달 컴포넌트를 import

function InputPicture() {

      //모달
      const [isModalOpen, setModalOpen] = useState(false);
      //모달 표시 내용 관리
      const [modalContent, setModalContent] = useState(null);

      // 모달 열기
      const handleOpenModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
      };
    
      // 모달 닫기
      const handleCloseModal = () => {
        setModalOpen(false);
        setModalContent(null); // 모달을 닫을 때 내용 초기화
      };

  return (
    <OuterContainer>
      <InnerContainer>
        <InnerWrapper>

        <OneBox>
          <Text>그림 그리기</Text>
            <PhotoBox>
            <PutPhoto onClick={() => handleOpenModal("house")}>
                <PutPhotoText1>클릭하여 집을 그려주세요.</PutPhotoText1>
            </PutPhoto>
            <PutPhoto onClick={() => handleOpenModal("tree")}>
                <PutPhotoText1>클릭하여 나무를 그려주세요.</PutPhotoText1>
            </PutPhoto>
            </PhotoBox>
            <PhotoBox>
            <PutPhoto onClick={() => handleOpenModal("man")}>
                <PutPhotoText1>클릭하여 남자 사람을 그려주세요.</PutPhotoText1>
            </PutPhoto>
            <PutPhoto onClick={() => handleOpenModal("woman")}>
                <PutPhotoText1>클릭하여 여자 사람을 그려주세요.</PutPhotoText1>
            </PutPhoto>
            </PhotoBox>

        </OneBox>


        <DraButtonBox>
            <DraButton>검사 결과 보러가기</DraButton>
            </DraButtonBox>


        </InnerWrapper>
      </InnerContainer>
       {/* DrawModal 컴포넌트 추가 */}
       <DrawModal isOpen={isModalOpen} onClose={handleCloseModal} content={modalContent}/>
    </OuterContainer>
  );
}

export default InputPicture;

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
  height: 51.815rem; //477px;
  padding-top: 2.5rem; //40px;
  padding-bottom: 2.5rem; //40px;
  justify-content: center;
  display: flex;
  background: white;
  border-radius: 0.625rem; //10px;
  margin-top: 1.875rem;
  margin-bottom: 1.875rem;

  ${theme.media.mobile`
  padding: 2rem 1rem;
  width: 80%;
  height: 70%;

`}
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;
  ${theme.media.mobile`
  justify-content: flex-start;
  align-items: center;
`}
`;

const Text = styled.text`
    color: #27282B;
    text-align: center;
    font-family: Pretendard-Regular;
    font-size: 1.625rem; //26px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 39px */
    margin-bottom: 0.625rem;

  ${theme.media.mobile`
    font-size: 0.875rem;
  `}
`;

const PhotoBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-top: -0.625rem;

  ${theme.media.mobile`

  
`}
`;

const PutPhoto = styled.div`
    display: flex;
    width: 17.5rem;
    height: 3.5rem;
    padding: 4.375rem 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border-radius: 0.375rem;
    border: 1px solid #E0E1E9;
    background: #FDFDFF;

  ${theme.media.mobile`

  
`}
`;

const PutPhotoText1 = styled.text`

  ${theme.media.mobile`

  
`}
`;

const PutPhotoText2 = styled.text`

    color: #97999F;
    font-family: Pretendard-Regular;
    font-size: 0.875rem; //14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 21px */

  ${theme.media.mobile`

  
`}
`;

const Text1 = styled.text`

    color:#4D4F56;
    text-align: center;
    font-family: Pretendard-Regular;
    font-size: 0.875rem; //14px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 21px */

  ${theme.media.mobile`

  
`}
`;

const OneBox = styled.text`

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem; //20px;
    align-self: stretch;

  ${theme.media.mobile`

  
`}
`;

const TwoBox = styled.text`

    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;

  ${theme.media.mobile`

  
`}
`;

const DraButton = styled.button`
  width: 10rem; //120px;
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