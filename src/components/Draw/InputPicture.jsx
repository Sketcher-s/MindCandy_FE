import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { theme } from "../../theme";
import { useRecoilState } from "recoil";
import { LoginState } from "../../recoil/recoilState";
import DrawModal from "./DrawModal"; // 위에서 만든 모달 컴포넌트를 import

function InputPicture() {
  const Navigate = useNavigate();

  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if (!isLoggedIn) {
    Navigate("/");
  }

  const [jwtToken, setjwtToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //모달
  const [isModalOpen, setModalOpen] = useState(false);
  //모달 표시 내용 관리
  const [modalContent, setModalContent] = useState(null);

  // useEffect를 사용하여 컴포넌트가 마운트될 때 토큰을 가져옵니다.
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setjwtToken(token);
  }, []);

  // 모달 열기
  const handleOpenModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalOpen(false);
    // setModalContent(null); // 모달을 닫을 때 내용 초기화
  };

  // Recognition에서 받은 파일 데이터를 저장하는 함수
  // const handleRecognitionResponse = (data, pictureType, base64Images) => {
  const handleRecognitionResponse = (data, pictureType, base64Images) => {
    console.log("콘솔에 base64 이미지 출력:", base64Images);

    const imageBlob = data.file; // 서버 응답에서 파일이 포함된 부분
    const file = new File([imageBlob], `${pictureType}.png`, {
      type: "image/png",
    });

    setImageFiles((prevFiles) => ({
      ...prevFiles,
      [pictureType]: file,
    }));

    // 파일을 URL로 변환하여 미리보기 URL 생성
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({
      ...prev,
      [pictureType]: base64Images,
    }));

    setImagePreviews((prev) => ({
      ...prev,
      // [pictureType]: base64Images, // 그림 데이터를 미리보기 상태에 저장
      [pictureType]: fileUrl, // 그림 데이터를 미리보기 상태에 저장
    }));

    // 추가된 부분: pictureRequestData 업데이트
    setPictureRequestData((prevData) => [
      ...prevData,
      { pictureType, value: data.value }, // 'someValue'는 실제 데이터에 맞게 변경
    ]);
  };

  //fileupload에서 받은 데이터를 다시 넣기 위한 부분
  const [pictureRequestData, setPictureRequestData] = useState([]);

  // 이미지 사이즈
  const [imageFiles, setImageFiles] = useState({
    HOUSE: null,
    TREE: null,
    MALE: null,
    FEMALE: null,
  });

  // 이미지를 미리보기할 URL -> 읻단 추가
  const [previewUrls, setPreviewUrls] = useState({
    HOUSE: null,
    TREE: null,
    MALE: null,
    FEMALE: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    HOUSE: null,
    TREE: null,
    MALE: null,
    FEMALE: null,
  });

  // Base64로 인코딩된 이미지
  const [base64Images, setBase64Images] = useState({
    HOUSE: null,
    TREE: null,
    MALE: null,
    FEMALE: null,
  });

  // 모든 이미지 파일을 모아서 배열로 서버로 전송하는 함수
  const handleSubmit = async () => {
    if (!jwtToken) {
      console.error("인증권한 없음");
      return;
    }

    const formData = new FormData();

    // FormData에 파일 추가 (null이 아닌지 체크)
    if (imageFiles.HOUSE) {
      console.log("Adding HOUSE file to FormData:", imageFiles.HOUSE);
      formData.append("fileList", imageFiles.HOUSE);
    } else {
      console.log("HOUSE file is null");
    }

    if (imageFiles.TREE) {
      console.log("Adding TREE file to FormData:", imageFiles.TREE);
      formData.append("fileList", imageFiles.TREE);
    } else {
      console.log("TREE file is null");
    }

    if (imageFiles.MALE) {
      console.log("Adding MALE file to FormData:", imageFiles.MALE);
      formData.append("fileList", imageFiles.MALE);
    } else {
      console.log("MALE file is null");
    }

    if (imageFiles.FEMALE) {
      console.log("Adding FEMALE file to FormData:", imageFiles.FEMALE);
      formData.append("fileList", imageFiles.FEMALE);
    } else {
      console.log("FEMALE file is null");
    }

    // FormData에 추가된 파일 확인
    for (let [key, value] of formData.entries()) {
      console.log(key, value); // FormData에 추가된 파일 출력
    }

    // pictureRequestDtoList에 업로드된 파일의 정보를 사용
    console.log("현재 pictureRequestData 상태: ", pictureRequestData); // 상태 확인

    // pictureRequestDtoList 추가
    formData.append(
      "inspectRequest",
      JSON.stringify({
        pictureRequestDtoList: pictureRequestData, // 수정된 부분: pictureRequestData 사용
        requiredTime: new Date().toISOString(),
      })
    );

    // FormData에 추가된 데이터 로그 출력
    console.log("FormData 전체 내용:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch(
        "https://dev.catchmind.shop/api/picture/analysis",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          body: formData, // FormData 전송
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("검사 요청 성공:", data);
        const resultId = data.result.id;
        console.log("resultId: ", resultId);
        Navigate("/result", {
          state: { resultId }, // state로 resultId 값을 전달
        });
      } else {
        console.error("검사 요청 실패:", await response.text());
      }
    } catch (error) {
      console.error("검사 요청 오류:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ContentType = {
    HOUSE: "house",
    TREE: "tree",
    MALE: "male",
    FEMALE: "female",
  };

  console.log(imageFiles);

  return (
    <OuterContainer>
      <InnerContainer>
        <InnerWrapper>
          <OneBox>
            <Text>그림 그리기</Text>
            <PhotoBox>
              <PutPhoto onClick={() => handleOpenModal(ContentType.HOUSE)}>
                {/* 이미지가 없을 때만 텍스트 표시 */}
                {!imagePreviews.HOUSE && (
                  <PutPhotoText1>클릭하여 집을 그려주세요.</PutPhotoText1>
                )}

                {/* 이미지 미리보기 */}
                {imagePreviews.HOUSE && (
                  <img
                    src={previewUrls.HOUSE}
                    alt="House Preview"
                    style={{
                      width: "17.5rem",
                      height: "17.5rem",
                      borderRadius: "0.375rem",
                    }}
                  />
                )}
              </PutPhoto>
              <PutPhoto onClick={() => handleOpenModal(ContentType.TREE)}>
                {/* 이미지가 없을 때만 텍스트 표시 */}
                {!imagePreviews.TREE && (
                  <PutPhotoText1>클릭하여 나무을 그려주세요.</PutPhotoText1>
                )}

                {/* 이미지 미리보기 */}
                {imagePreviews.TREE && (
                  <img
                    src={previewUrls.TREE}
                    alt="Tree Preview"
                    style={{
                      width: "17.5rem",
                      height: "17.5rem",
                      borderRadius: "0.375rem",
                    }}
                  />
                )}
              </PutPhoto>
            </PhotoBox>
            <PhotoBox>
            <PutPhoto onClick={() => handleOpenModal(ContentType.MALE)}>
                {/* 이미지가 없을 때만 텍스트 표시 */}
                {!imagePreviews.MALE && (
                  <PutPhotoText1>클릭하여 남자사람을 그려주세요.</PutPhotoText1>
                )}

                {/* 이미지 미리보기 */}
                {imagePreviews.MALE && (
                  <img
                    src={previewUrls.MALE}
                    alt="Male Preview"
                    style={{
                      width: "17.5rem",
                      height: "17.5rem",
                      borderRadius: "0.375rem",
                    }}
                  />
                )}
              </PutPhoto>
              <PutPhoto onClick={() => handleOpenModal(ContentType.FEMALE)}>
                {/* 이미지가 없을 때만 텍스트 표시 */}
                {!imagePreviews.FEMALE && (
                  <PutPhotoText1>클릭하여 여자사람을 그려주세요.</PutPhotoText1>
                )}

                {/* 이미지 미리보기 */}
                {imagePreviews.FEMALE && (
                  <img
                    src={previewUrls.FEMALE}
                    alt="Male Preview"
                    style={{
                      width: "17.5rem",
                      height: "17.5rem",
                      borderRadius: "0.375rem",
                    }}
                  />
                )}
              </PutPhoto>
            </PhotoBox>
          </OneBox>

          <DraButtonBox>
            <DraButton onClick={handleSubmit}>검사 결과 보러가기</DraButton>
          </DraButtonBox>
        </InnerWrapper>
      </InnerContainer>

      {/* DrawModal 컴포넌트 추가 */}
      <DrawModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        content={modalContent}
        onSubmit={handleSubmit}
        handleRecognitionResponse={handleRecognitionResponse}
        setPreviewUrls={setPreviewUrls}
      />
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
  color: #27282b;
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
  border: 1px solid #e0e1e9;
  background: #fdfdff;

  ${theme.media.mobile`

  
`}
`;

const PutPhotoText1 = styled.text`
  ${theme.media.mobile`

  
`}
`;

const PutPhotoText2 = styled.text`
  color: #97999f;
  font-family: Pretendard-Regular;
  font-size: 0.875rem; //14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 21px */

  ${theme.media.mobile`

  
`}
`;

const Text1 = styled.text`
  color: #4d4f56;
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
  background: #9386e0;
  border-radius: 0.25rem; //4px;
  border: 0.0625rem solid #9386e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.625rem;
  margin-left: 0.16rem;

  ${theme.media.mobile`
    display: none;
`}
`;
