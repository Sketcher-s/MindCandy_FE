import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { theme } from "../../theme";
import Loading from "../Draw/Loading";
import { useRecoilState } from "recoil";
import { LoginState } from "../../recoil/recoilState";
import PropTypes from "prop-types";
import { ReactComponent as Photochecktrue } from "../../assets/Draw/photochecktrue.svg";
import { ReactComponent as Photocheckfalse } from "../../assets/Draw/photocheckfalse.svg";
import Modal from "../Modal";
import { useSetRecoilState } from "recoil";
import { loadingStatusState } from "../../recoil/recoilState";

// imgFile props에 대한 유효성 검사를 추가
InputPhoto.propTypes = {
  // imgFile은 File 객체로 전달되어야 함
  imgFile: PropTypes.instanceOf(File),
};

// loading 상태에 대해서 상위 컴포넌트에서 loading 페이지로 넘겨줘야 함
// 성공했을 때는 navigate로 result 페이지로 이동하면 되지만,
// 실패했을 때는 isLoading의 값이 업데이트 될 수 없음..
// recoil로 전역적 상태관리를 해야함
const LoadingStatus = {
  Loading: "Loading",
  Fail: "Fail"
};  

function InputPhoto() {
  //fileupload에서 받은 데이터를 다시 넣기 위한 부분
  const [pictureRequestData, setPictureRequestData] = useState([]);
  const setLoadingStatus = useSetRecoilState(loadingStatusState);

  //페이지 이동 부분
  const Navigate = useNavigate();

  // 이미지 사이즈
  const [imageFiles, setImageFiles] = useState({
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

  //사진 활성, 비활성을 위한 disabledImages 상태 추가
  const [disabledImages, setDisabledImages] = useState({
    HOUSE: false,
    TREE: false,
    MALE: false,
    FEMALE: false,
  });

  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if (!isLoggedIn) {
    Navigate("/");
  }
  // useEffect를 사용하여 컴포넌트가 마운트될 때 토큰을 가져옵니다.
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setjwtToken(token);
  }, []);

  const [jwtToken, setjwtToken] = useState("");
  //const [isLoading, setIsLoading] = useState(false);

  // 버튼 활성화 상태를 관리할 useState 추가
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // 모든 사진과 시간 입력 여부를 확인하는 함수
  const checkFormCompletion = () => {
    const allImagesUploaded = Object.values(imageFiles).every(
      (file) => file !== null
    );

    const allTimeEntered =
      startHours !== "" &&
      startMinutes !== "" &&
      endHours !== "" &&
      endMinutes !== "";

    setIsButtonEnabled(allImagesUploaded && allTimeEntered);
  };

  // 시간 관련 상태
  const [startHours, setStartHours] = useState("");
  const [startMinutes, setStartMinutes] = useState("");
  const [endHours, setEndHours] = useState("");
  const [endMinutes, setEndMinutes] = useState("");

  // 각 파일 선택 또는 시간 변경 시마다 호출
  useEffect(() => {
    checkFormCompletion();
  }, [imageFiles, startHours, startMinutes, endHours, endMinutes]);

  // 파일이 선택되었을 때 처리하는 함수
  const handleFileChange = (pictureType) => (event) => {
    const file = event.target.files[0]; // 사용자가 선택한 파일
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({ ...prev, [pictureType]: reader.result }));
        setImageFiles((prev) => ({ ...prev, [pictureType]: file }));
        console.log(`파일 선택 완료 (${pictureType}):`, file);

        // 파일이 선택되면 바로 업로드
        uploadFile(file, pictureType);

        // 파일을 Base64로 변환하여 저장
        setBase64Images((prev) => ({
          ...prev,
          [pictureType]: reader.result.split(",")[1],
        }));
      };
      reader.readAsDataURL(file); // 파일을 읽어 미리보기 URL로 변환
    } else {
      console.error(
        "선택된 파일이 이미지가 아니거나 파일이 선택되지 않았습니다."
      );
    }
  };

  // 서버로 파일 업로드하는 함수
  const uploadFile = async (file, pictureType) => {
    if (!jwtToken) {
      console.error("인증권한 없음");
      return;
    }

    console.log("JWT Token:", jwtToken);

    if (!file) {
      console.error(`파일이 선택되지 않음 (${pictureType})`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pictureType", JSON.stringify({ pictureType })); // pictureType을 객체로 전송

    console.log("FormData에 추가된 항목들:");
    // FormData 내용 로그 출력
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      const response = await fetch(
        "https://dev.catchmind.shop/api/picture/recognition",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`, // 사용자 토큰을 헤더에 포함하여 서버로 전송
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`파일 업로드 성공 (${pictureType}):`, data);

        console.log("서버 응답 데이터: ", data); // 서버 응답 값 확인

        // value 값이 문자열인지 확인
        const value = data.value; // 적절한 필드를 확인하세요
        console.log("Value:", value); // value 내용 확인
        console.log("Value type:", typeof value); // value 타입 확인 (여기서 'string'으로 나와야 함)

        // pictureType과 응답 데이터의 특정 필드를 value로 추가
        // setPictureRequestData((prevData) => [
        //   ...prevData,
        //   {
        //     pictureType: pictureType, // 이미지 타입 (예: HOUSE, TREE, MALE, FEMALE)
        //     value: value || "", // 서버 응답 데이터에서 필요한 필드 (예: 값이 들어가야 할 필드)
        //   },
        // ]);

        // 업데이트 로직
        setPictureRequestData((prevData) => {
          const newData = [...prevData];
          const index = newData.findIndex(item => item.pictureType === pictureType);
          if (index !== -1) {
              newData[index] = {
                  pictureType: pictureType,
                  value: data.value || "", // 적절한 데이터 필드 사용
              };
          } else {
              newData.push({
                  pictureType: pictureType,
                  value: data.value || "",
              });
          }
          return newData;
      });

        // 빈 값 또는 공백 문자열에 대한 처리
        if (!value || value.trim() === "") {
          console.log(
            `"${pictureType}"의 인식 결과가 없습니다. 활성화 합니다.`
          );
          setDisabledImages((prev) => ({ ...prev, [pictureType]: false }));
        } else {
          console.log("Value:", value);
          console.log(
            `"${pictureType}"의 인식 결과가 있습니다. 비활성화 합니다.`
          );
          setDisabledImages((prev) => ({ ...prev, [pictureType]: true }));
        }
      } else {
        console.error(
          `파일 업로드 실패 (${pictureType})`,
          await response.text()
        );
      }
    } catch (error) {
      console.error(`파일 업로드 오류 (${pictureType}):`, error.message);
    }
  };

  // 시간 유효성 검사 함수
  const handleHoursChange = (setter) => (e) => {
    const value = e.target.value;
    if (
      /^\d{0,2}$/.test(value) &&
      parseInt(value) >= 0 &&
      parseInt(value) <= 23
    ) {
      setter(value);
    }
  };

  const handleMinutesChange = (setter) => (e) => {
    const value = e.target.value;
    if (
      /^\d{0,2}$/.test(value) &&
      parseInt(value) >= 0 &&
      parseInt(value) <= 59
    ) {
      setter(value);
    }
  };

  // 소비된 시간 계산
  const calculateConsumedTime = () => {
    const start = new Date();
    start.setHours(parseInt(startHours));
    start.setMinutes(parseInt(startMinutes));

    const end = new Date();
    end.setHours(parseInt(endHours));
    end.setMinutes(parseInt(endMinutes));

    const diffMs = end - start;
    if (diffMs < 0) {
      console.error("종료 시간이 시작 시간보다 이릅니다.");
      return null;
    }
    const diffMins = Math.floor(diffMs / 60000); // 밀리초를 분으로 변환
    const hours = Math.floor(diffMins / 60); // 시간을 계산
    const minutes = diffMins % 60; // 분을 계산

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  // 모든 이미지 파일을 모아서 배열로 서버로 전송하는 함수
  const handleSubmit = async () => {
    if (!jwtToken) {
      console.error("인증권한 없음");
      return;
    }

    const requiredTime = calculateConsumedTime();
    if (!requiredTime) {
      console.error("시간 계산에 오류가 있습니다.");
      return;
    }

    //setIsLoading(true); //로딩 시작
    
    const formData = new FormData();

    // FormData에 각 파일을 개별적으로 추가
    formData.append("fileList", imageFiles.HOUSE); // 파일 자체를 append
    formData.append("fileList", imageFiles.TREE);
    formData.append("fileList", imageFiles.MALE);
    formData.append("fileList", imageFiles.FEMALE);

    // pictureRequestDtoList에 업로드된 파일의 정보를 사용
    console.log("현재 pictureRequestData 상태: ", pictureRequestData); // 상태 확인

    const requestData = {
      pictureRequestDtoList: pictureRequestData.map((item) => ({
        pictureType: item.pictureType,
        value: item.value, // 여기서 'string' 대신 실제로 서버에 적합한 문자열 값을 넣으세요
      })),
      requiredTime,
    };

    // requestData를 JSON 형식으로 변환하여 FormData에 추가
    formData.append("inspectRequest", JSON.stringify(requestData));

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
      console.log("inputphoto에서 loading보내는 값: ", loadingStatusState);
    } finally{
      sessionStorage.removeItem("loadingImg"); // loading 세션에 저장했던 이미지 삭제하기
    }
  };

  const fileInputRefs = useRef({
    HOUSE: null,
    TREE: null,
    MALE: null,
    FEMALE: null,
  });

  const handleButtonClick = (type) => () => {
    fileInputRefs.current[type].click();
  };

  const handleDoneClick = () => {
    const state = Navigate?.state || {}; // state에서 imageData 가져오기
    // loading 페이지로 집 그림 넘기기
    //const houseImg = imageFiles.TREE;
    const { imageData } = state;
    const loadingImg = imagePreviews.HOUSE;
    console.log("완료 버튼 클릭, 대표 이미지 값: ", loadingImg);
    Navigate("/loading", { state: { loadingImg } });
    handleSubmit(imageData); // 서버로 이미지 전송
  };

  const uploadTexts = [
    "집 그림을 첨부해주세요.",
    "남자 사람 그림을 첨부해주세요.",
    "나무 그림을 첨부해주세요.",
    "여자 사람 그림을 첨부해주세요.",
  ];

  const uploadTexts1 = [
    "집 그림을 첨부해주세요.",
    "남자 사람 그림을 첨부해주세요.",
    "나무 그림을 첨부해주세요.",
    "여자 사람 그림을 첨부해주세요.",
  ];

  const uploadTexts2 = [
    "종이를 가로 ▂ 방향으로 그려주세요.",
    "종이를 세로 ▐ 방향으로 그려주세요.",
    "종이를 세로 ▐ 방향으로 그려주세요.",
    "종이를 세로 ▐ 방향으로 그려주세요.",
  ];

  return (
    <OuterContainer>
      {loadingStatusState === LoadingStatus.Loading &&
        <Loading />
      }
      
      <InnerContainer>
        <InnerWrapper>
          <OneBox>
            <Text>사진 첨부</Text>
            <PhotoBox>
              <Row>
                {["HOUSE", "MALE"].map((type, index) => (
                  <PutPhoto
                    key={type}
                    onClick={handleButtonClick(type)}
                    disabled={!disabledImages[type]} //비활성화 상태 전달
                    hasImage={!!imagePreviews[type]} // 이미지가 있는지 여부 전달
                  >
                    {imagePreviews[type] && (
                      <IconOverlay>
                        {disabledImages[type] ? (
                          <Photochecktrue width={24} height={24} /> // 비활성화된 경우 녹색 체크 표시
                        ) : (
                          <Photocheckfalse width={24} height={24} /> // 활성화된 경우 빨간 X 표시
                        )}
                      </IconOverlay>
                    )}
                    <TextWrapper>
                      <div style={{ position: "relative" }}>
                        {/* 이미지 미리보기 또는 업로드 텍스트 */}
                        {imagePreviews[type] ? (
                          <>
                            <PreviewImage
                              src={imagePreviews[type]}
                              alt={`Image Preview ${type}`}
                              isDisabled={!disabledImages[type]} // 비활성화 여부 전달
                            />
                          </>
                        ) : (
                          <>
                            <PutPhotoText1>{uploadTexts[type]}</PutPhotoText1>
                            <PutPhotoText1>{uploadTexts1[index]}</PutPhotoText1>
                            <div></div>
                            <PutPhotoText2>{uploadTexts2[index]}</PutPhotoText2>
                          </>
                        )}

                        <HiddenFileInput
                          type="file"
                          ref={(el) => (fileInputRefs.current[type] = el)}
                          onChange={handleFileChange(type)}
                          accept="image/*"
                          disabled={disabledImages[type]} //비활성화 여부 적용
                        />
                      </div>
                    </TextWrapper>
                  </PutPhoto>
                ))}
              </Row>

              <Row>
                {["TREE", "FEMALE"].map((type, index) => (
                  <PutPhoto
                    key={type}
                    onClick={handleButtonClick(type)}
                    disabled={!disabledImages[type]} //비활성화 상태 전달
                    hasImage={!!imagePreviews[type]} // 이미지가 있는지 여부 전달
                  >
                    {imagePreviews[type] && (
                      <IconOverlay>
                        {disabledImages[type] ? (
                          <Photochecktrue width={24} height={24} /> // 비활성화된 경우 녹색 체크 표시
                        ) : (
                          <Photocheckfalse width={24} height={24} /> // 활성화된 경우 빨간 X 표시
                        )}
                      </IconOverlay>
                    )}
                    <TextWrapper>
                      <div style={{ position: "relative" }}>
                        {/* 이미지 미리보기 또는 업로드 텍스트 */}
                        {imagePreviews[type] ? (
                          <>
                            <PreviewImage
                              src={imagePreviews[type]}
                              alt={`Image Preview ${type}`}
                              isDisabled={!disabledImages[type]} // 비활성화 여부 전달
                            />
                          </>
                        ) : (
                          <>
                            <PutPhotoText1>{uploadTexts[type]}</PutPhotoText1>
                            <PutPhotoText1>
                              {uploadTexts1[index + 2]}
                            </PutPhotoText1>
                            <div></div>
                            <PutPhotoText2>
                              {uploadTexts2[index + 2]}
                            </PutPhotoText2>
                          </>
                        )}

                        <HiddenFileInput
                          type="file"
                          ref={(el) => (fileInputRefs.current[type] = el)}
                          onChange={handleFileChange(type)}
                          accept="image/*"
                          disabled={disabledImages[type]} //비활성화 여부 적용
                        />
                      </div>
                    </TextWrapper>
                  </PutPhoto>
                ))}
              </Row>
            </PhotoBox>
          </OneBox>

          <TwoBox>
            <Text>소요 시간</Text>
            <Text1>
              아이가 그림그리기 시작한 시각과 완료한 시각을 적어주세요.
            </Text1>
          </TwoBox>

          <TimerBox>
            <Timer>
              <SSBox>
                <StartNStop>시작</StartNStop>
                <TimeContainer>
                  <input
                    type="text"
                    value={startHours}
                    onChange={handleHoursChange(setStartHours)}
                    placeholder="00" // 시간 입력 필드
                    maxLength={2} // 최대 2자리 숫자만 입력 가능
                    style={{
                      color: "#66676e",
                      textAlign: "center",
                      fontFamily: "Pretendard-Regular",
                      fontSize: "1rem",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      width: "4rem",
                      height: "2.75rem",
                      borderRadius: "0.25rem",
                      backgroundColor: "#f3f3f6",
                      border: "none",
                      marginRight: "0.5rem",
                    }}
                  />
                  {/* ':' 표시 */}
                  <span style={{ fontSize: "1rem", fontWeight: 500 }}>:</span>
                  {/* 분 입력 */}
                  <input
                    type="text"
                    value={startMinutes}
                    onChange={handleMinutesChange(setStartMinutes)}
                    placeholder="00" // 분 입력 필드
                    maxLength={2} // 최대 2자리 숫자만 입력 가능
                    style={{
                      color: "#66676e",
                      textAlign: "center",
                      fontFamily: "Pretendard-Regular",
                      fontSize: "1rem",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      width: "4rem",
                      height: "2.75rem",
                      borderRadius: "0.25rem",
                      backgroundColor: "#f3f3f6",
                      border: "none",
                      marginLeft: "0.5rem",
                    }}
                  />
                </TimeContainer>
              </SSBox>
            </Timer>

            <Timer>
              <And> ~ </And>
            </Timer>

            <Timer>
              <SSBox>
                <StartNStop>종료</StartNStop>
                <TimeContainer>
                  <input
                    type="text"
                    value={endHours}
                    onChange={handleHoursChange(setEndHours)}
                    placeholder="00" // 시간 입력 필드
                    maxLength={2} // 최대 2자리 숫자만 입력 가능
                    style={{
                      color: "#66676e",
                      textAlign: "center",
                      fontFamily: "Pretendard-Regular",
                      fontSize: "1rem",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      width: "4rem",
                      height: "2.75rem",
                      borderRadius: "0.25rem",
                      backgroundColor: "#f3f3f6",
                      border: "none",
                      marginRight: "0.5rem",
                    }}
                  />

                  {/* ':' 표시 */}
                  <span style={{ fontSize: "1rem", fontWeight: 500 }}>:</span>

                  {/* 분 입력 */}
                  <input
                    type="text"
                    value={endMinutes}
                    onChange={handleMinutesChange(setEndMinutes)}
                    placeholder="00" // 분 입력 필드
                    maxLength={2} // 최대 2자리 숫자만 입력 가능
                    style={{
                      color: "#66676e",
                      textAlign: "center",
                      fontFamily: "Pretendard-Regular",
                      fontSize: "1rem",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "150%",
                      width: "4rem",
                      height: "2.75rem",
                      borderRadius: "0.25rem",
                      backgroundColor: "#f3f3f6",
                      border: "none",
                      marginLeft: "0.5rem",
                    }}
                  />
                </TimeContainer>
              </SSBox>
            </Timer>
          </TimerBox>

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
    </OuterContainer>
  );
}

export default InputPhoto;

// 스타일 컴포넌트 정의
const OuterContainer = styled.div`
  width: 100%;
  // height: 93vh;
  height: 90vh; // 뷰포트의 전체 높이
  overflow-y: auto; /* 수직 스크롤 활성화 */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.875rem; //30px;
  display: flex;
  background: #f3f3f6;

  ${theme.media.mobile`
        margin-top: 2rem;
          height: 100%; // 뷰포트의 전체 높이

`}
`;

const InnerContainer = styled.div`
  // width: 40.25rem; //644px;
  // height: 61.815rem; //477px;
  // height: 110vh; // 뷰포트의 전체 높이
  padding-top: 2.5rem; //40px;
  padding-bottom: 2.5rem; //40px;
  justify-content: center;
  display: flex;
  background: white;
  border-radius: 0.625rem; //10px;
  margin-bottom: 1.875rem;

  ${theme.media.mobile`
  // width: 80%;
  // height:93vh;
  height:170%;
  margin-top: 55rem;
  margin-bottom: 10rem;
  width: 21.125rem; //338px;

`}

  ${theme.media.desktop`
  margin-top: 13rem;
  padding: 1.625rem;
  width: 40.25rem; //644px;
  height: 110vh; // 뷰포트의 전체 높이
`}

 ${theme.media.tablet`
  margin-top: 3rem;
  padding: 1.625rem;
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
    font-size: 1.375rem; //22px;
  `}
`;

const PhotoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: -0.625rem;
  width: 35.625rem;

  ${theme.media.mobile`
      flex-direction: column;
  
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
  overflow: hidden; /* 내용이 넘치지 않도록 처리 */
  position: relative; /* 아이콘 오버레이 위치를 위해 */
  transition: background-color 0.3s ease; /* 부드러운 색상 전환 효과 */

  ${theme.media.mobile`
  
`}
`;

const Row = styled.div`
  display: flex;
  justify-content: space-around; // 컴포넌트 사이에 고르게 간격을 두기
  margin-bottom: 20px; // 다음 Row와의 간격
  flex-direction: column;
  gap: 0.625rem;

  ${theme.media.mobile`

    flex-direction: column;
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

const StartNStop = styled.text`
  color: #66676e;
  text-align: center;
  font-family: Pretendard-Regular;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 21px */
  width: 11.25rem;
  height: 1.313rem;

  ${theme.media.mobile`

  
`}
`;

const And = styled.div`
  display: flex;
  width: 0.688rem; //11px;
  height: 2.75rem; //44px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.875rem; //10px;
  color: #66676e;
  text-align: center;
  font-family: Pretendard-Regular;
  font-size: 1rem; //16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 24px */
  padding-right: 0.625rem;
  padding-left: 0.625rem;
  padding-top: 0.5rem;

  ${theme.media.mobile`

  
`}
`;

const OneBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem; //20px;
  align-self: stretch;

  ${theme.media.mobile`

`}
`;

const TwoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;

  ${theme.media.mobile`

  
`}
`;

const TimerBox = styled.div`
  display: flex;
  width: 11.25rem;
  height: 4.688rem;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: 1.875rem;

  ${theme.media.mobile`

    flex-direction: column;
    padding : 8rem;
`}
`;

const Timer = styled.div`
  ${theme.media.mobile`
  
`}
`;

const TimeContainer = styled.div`
  display: flex;
  width: 11.25rem; //180px;
  height: 1.5rem;
  padding: 0.625rem; //10px;
  justify-content: center;
  align-items: center;
  gap: 0.625rem; //10px;
  border-radius: 0.25rem; //4px;
  background: #f3f3f6;

  ${theme.media.mobile`

`}
`;

const SSBox = styled.div`
  margin-bottom: 0.625rem;

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
  // border: 0.0625rem solid #9386e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.625rem;
  margin-left: 0.16rem;

  ${theme.media.mobile`
`}
`;

//파일 관련
const HiddenFileInput = styled.input`
  display: none;
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

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  align-items: center; /* 가로 가운데 정렬 */
  justify-content: center; /* 세로 가운데 정렬 */
  height: 100%; /* 부모 컨테이너의 전체 높이 사용 */
  text-align: center; /* 텍스트 가운데 정렬 */
  gap: 8px; /* 각 텍스트 간 간격 설정 */
`;

const PreviewImage = styled.img`
  max-width: 100%; /* 이미지가 영역을 넘지 않도록 제한 */
  max-height: 100%; /* 이미지가 영역을 넘지 않도록 제한 */
  object-fit: contain; /* 이미지 비율 유지 */
  border-radius: 0.375rem;

   max-width: 100%; 
  max-height: 100%; 
  object-fit: contain; 
  transition: filter 0.3s, opacity 0.3s;

  ${({ isDisabled }) =>
    isDisabled &&
    `
    filter: grayscale(100%) brightness(40%); /* 어둡게 처리 */
    opacity: 0.4; /* 투명도 조절 */
  `}
`;
