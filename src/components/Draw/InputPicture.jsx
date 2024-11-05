import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { theme } from "../../theme";
import Loading from "../Draw/Loading";
import { useRecoilState } from "recoil";
import { LoginState } from "../../recoil/recoilState";
import DrawModal from "./DrawModal"; // 위에서 만든 모달 컴포넌트를 import
import { ReactComponent as Photochecktrue } from "../../assets/Draw/photochecktrue.svg";
import { ReactComponent as Photocheckfalse } from "../../assets/Draw/photocheckfalse.svg";
import { useSetRecoilState } from "recoil";
import { loadingStatusState } from "../../recoil/recoilState";

// loading 상태에 대해서 상위 컴포넌트에서 loading 페이지로 넘겨줘야 함
// 성공했을 때는 navigate로 result 페이지로 이동하면 되지만,
// 실패했을 때는 isLoading의 값이 업데이트 될 수 없음..
// recoil로 전역적 상태관리를 해야함
const LoadingStatus = {
  Loading: "Loading",
  Fail: "Fail"
}; 

function InputPicture() {
  const Navigate = useNavigate();
  const setLoadingStatus = useSetRecoilState(loadingStatusState);

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
  const [modalContent, setModalContent] = useState("");

  // useEffect를 사용하여 컴포넌트가 마운트될 때 토큰을 가져옵니다.
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setjwtToken(token);
  }, []);

  useEffect(() => {
    setIsButtonEnabled(
      disabledImages[ContentType.HOUSE] &
        disabledImages[ContentType.TREE] &
        disabledImages[ContentType.MALE] &
        disabledImages[ContentType.FEMALE]
    );
  }, [isModalOpen]);

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
  // Base64 데이터를 Blob으로 변환하는 함수
  const base64ToBlob = (base64Data, contentType = "image/png") => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
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

  //사진 활성, 비활성을 위한 disabledImages 상태 추가
  const [disabledImages, setDisabledImages] = useState({
    HOUSE: false,
    TREE: false,
    MALE: false,
    FEMALE: false,
  });

  // 버튼 활성화 상태를 관리할 useState 추가
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Recognition에서 받은 파일 데이터를 저장하는 함수
  const handleRecognitionResponse = (data, pictureType, base64Images) => {
    console.log("콘솔에 base64 이미지 출력:", base64Images);
    console.log("blob 데이터: ", data);
    console.log(pictureType);

    const base64Data = base64Images.split(",")[1]; // "data:image/png;base64," 부분 제거
    const imageBlob = base64ToBlob(base64Data); // Base64 데이터를 Blob으로 변환
    const file = new File([imageBlob], `${pictureType}.png`, {
      type: "image/png",
    });
    console.log("blob 파일 객체로 변환: ", file);

    setImageFiles((prevFiles) => ({
      ...prevFiles,
      [pictureType]: file,
    }));

    // 파일을 URL로 변환하여 미리보기 URL 생성
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({
      ...prev,
      [pictureType]: fileUrl,
    }));

    setImagePreviews((prev) => ({
      ...prev,
      [pictureType]: fileUrl, // 그림 데이터를 미리보기 상태에 저장
    }));

    // 추가된 부분: pictureRequestData 업데이트
    setPictureRequestData((prevData) => [
      ...prevData,
      { pictureType, value: data.value }, // 'someValue'는 실제 데이터에 맞게 변경
    ]);
  };

  // 모든 이미지 파일을 모아서 배열로 서버로 전송하는 함수
  const handleSubmit = async () => {
    if (!jwtToken) {
      console.error("인증권한 없음");
      return;
    }

    setIsLoading(true); //로딩 시작
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

      setLoadingStatus(LoadingStatus.Loading); // 로딩중..

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
        setLoadingStatus(LoadingStatus.Fail);
      }
    } catch (error) {
      console.error("검사 요청 오류:", error.message);
      setLoadingStatus(LoadingStatus.Fail);
      console.log("inputpicture에서 loading보내는 값: ", loadingStatusState);
    }
  };

  const handleDoneClick = () => {
    const state = Navigate?.state || {}; // state에서 imageData 가져오기
    const { imageData } = state;
    console.log(imageData);
    console.log("완료 버튼 클릭");
    const loadingImg = imagePreviews.HOUSE;
    Navigate("/loading", { state: { loadingImg } });
    handleSubmit(imageData); // 서버로 이미지 전송
  };

  const ContentType = {
    HOUSE: "HOUSE",
    TREE: "TREE",
    MALE: "MALE",
    FEMALE: "FEMALE",
  };

  return (
    <OuterContainer>
      {loadingStatusState === LoadingStatus.Loading && <Loading />}
      <InnerContainer>
        <InnerWrapper>
          <OneBox>
            <Text>그림 그리기</Text>
            <SubText>
              집 - 나무 - 남자 사람 - 여자 사람 순서대로 그려주세요
            </SubText>
            <PhotoBox>
              <PutPhoto
                onClick={() => handleOpenModal(ContentType.HOUSE)}
                disabled={!disabledImages[ContentType.HOUSE]} //비활성화 상태 전달
                hasImage={!!imagePreviews[ContentType.HOUSE]} // 이미지가 있는지 여부 전달
              >
                {/* 이미지가 없을 때만 텍스트 표시 */}
                {!imagePreviews.HOUSE && (
                  <PutPhotoText1>클릭하여 집을 그려주세요.</PutPhotoText1>
                )}

                {imagePreviews.HOUSE && (
                  <>
                    <IconOverlay>
                      {disabledImages[ContentType.HOUSE] ? (
                        <Photochecktrue width={24} height={24} /> // 비활성화된 경우 녹색 체크 표시
                      ) : (
                        <Photocheckfalse width={24} height={24} /> // 활성화된 경우 빨간 X 표시
                      )}
                    </IconOverlay>
                  </>
                )}

                {/* 이미지 미리보기 */}
                {imagePreviews.HOUSE && (
                  <img
                    src={previewUrls.HOUSE}
                    alt="house Preview"
                    style={{
                      width: "17.5rem",
                      height: "17.5rem",
                      borderRadius: "0.375rem",
                    }}
                  />
                )}
              </PutPhoto>
              <PutPhoto
                onClick={() => handleOpenModal(ContentType.TREE)}
                disabled={!disabledImages[ContentType.TREE]} //비활성화 상태 전달
                hasImage={!!imagePreviews[ContentType.TREE]} // 이미지가 있는지 여부 전달
              >
                {/* 이미지가 없을 때만 텍스트 표시 */}
                {!imagePreviews.TREE && (
                  <PutPhotoText1>클릭하여 나무을 그려주세요.</PutPhotoText1>
                )}

                {imagePreviews.TREE && (
                  <IconOverlay>
                    {disabledImages[ContentType.TREE] ? (
                      <Photochecktrue width={24} height={24} /> // 비활성화된 경우 녹색 체크 표시
                    ) : (
                      <Photocheckfalse width={24} height={24} /> // 활성화된 경우 빨간 X 표시
                    )}
                  </IconOverlay>
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
              <PutPhoto
                onClick={() => handleOpenModal(ContentType.MALE)}
                disabled={!disabledImages[ContentType.MALE]} //비활성화 상태 전달
                hasImage={!!imagePreviews[ContentType.MALE]} // 이미지가 있는지 여부 전달
              >
                {/* 이미지가 없을 때만 텍스트 표시 */}
                {!imagePreviews.MALE && (
                  <PutPhotoText1>클릭하여 남자사람을 그려주세요.</PutPhotoText1>
                )}

                {imagePreviews.MALE && (
                  <IconOverlay>
                    {disabledImages[ContentType.MALE] ? (
                      <Photochecktrue width={24} height={24} /> // 비활성화된 경우 녹색 체크 표시
                    ) : (
                      <Photocheckfalse width={24} height={24} /> // 활성화된 경우 빨간 X 표시
                    )}
                  </IconOverlay>
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
              <PutPhoto
                onClick={() => handleOpenModal(ContentType.FEMALE)}
                disabled={!disabledImages[ContentType.FEMALE]} //비활성화 상태 전달
                hasImage={!!imagePreviews[ContentType.FEMALE]} // 이미지가 있는지 여부 전달
              >
                {/* 이미지가 없을 때만 텍스트 표시 */}
                {!imagePreviews.FEMALE && (
                  <PutPhotoText1>클릭하여 여자사람을 그려주세요.</PutPhotoText1>
                )}

                {imagePreviews.FEMALE && (
                  <IconOverlay>
                    {disabledImages[ContentType.FEMALE] ? (
                      <Photochecktrue width={24} height={24} /> // 비활성화된 경우 녹색 체크 표시
                    ) : (
                      <Photocheckfalse width={24} height={24} /> // 활성화된 경우 빨간 X 표시
                    )}
                  </IconOverlay>
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

          <DraButtonBox
            style={{
              backgroundColor: isButtonEnabled ? "#9386E0" : "#DDDDF7", // 버튼 색상 변경
              cursor: isButtonEnabled ? "pointer" : "not-allowed",
            }}
          >
            <DraButton
              onClick={handleDoneClick}
              disabled={!isButtonEnabled} // 버튼 활성화 여부 제어
            >
              검사 결과 보러가기
            </DraButton>
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
        prevUrl={previewUrls}
        setDisabledImages={setDisabledImages}
        disabledImages={disabledImages}
        setIsButtonEnabled={setIsButtonEnabled}
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

  ${theme.media.mobile`
    font-size: 0.875rem;
  `}
`;

const SubText = styled.text`
  color: #27282b;
  text-align: center;
  font-family: Pretendard-Regular;
  font-size: 0.875; //14px;
  font-style: normal;
  font-weight: 700;
  line-height: 1.313rem /* 21px */
  margin-bottom: 0.625rem;
  padding-bottom: 0.625rem;

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
  // display: flex;
  // width: 17.5rem;
  // height: 3.5rem;
  // padding: 4.375rem 0;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  // gap: 0.625rem;
  // border-radius: 0.375rem;
  // border: 1px solid #e0e1e9;
  // background: #fdfdff;

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
  overflow: hidden; /* 내용이 넘치지 않도록 처리 */
  position: relative; /* 아이콘 오버레이 위치를 위해 */
  transition: background-color 0.3s ease; /* 부드러운 색상 전환 효과 */

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
  //border: 0.0625rem solid #9386e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.625rem;
  margin-left: 0.16rem;

  ${theme.media.mobile`
    display: none;
`}
`;

//아이콘 관련 스타일
const IconOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;
