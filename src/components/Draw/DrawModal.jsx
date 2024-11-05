import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import { theme } from "../../theme";
import { ReactComponent as Geraser } from "../../assets/Draw/Geraser.svg";
import { ReactComponent as Gpencil } from "../../assets/Draw/Gpencil.svg";
import { ReactComponent as Gtrash } from "../../assets/Draw/Gtrash.svg";
import { ReactComponent as Peraser } from "../../assets/Draw/Peraser.svg";
import { ReactComponent as Ppencil } from "../../assets/Draw/Ppencil.svg";
import { ReactComponent as Ptrash } from "../../assets/Draw/Ptrash.svg";
import { ReactComponent as Draw } from "../../assets/Draw/Draw.svg";
import { ReactComponent as ErasePart } from "../../assets/Draw/ErasePart.svg";
import { ReactComponent as EraseAll } from "../../assets/Draw/EraseAll.svg";
import { atom } from "recoil";
import {} from "recoil";
import { useRecoilState } from "recoil";
import { LoginState } from "../../recoil/recoilState";

// Recoil을 사용하여 캔버스의 내용을 상태로 관리
const canvasContentState = atom({
  key: "canvasContentState",
  default: null,
});

// default 값이 type 이 default
Gpencil.defaultProps = {
  type: "default",
};

const DrawModal = ({
  isOpen,
  onClose,
  content,
  onSubmit,
  handleRecognitionResponse,
  setPreviewUrls, // 그림의 타입을 전달
  pictureType,
  prevUrl,
  setDisabledImages,
  disabledImages,
}) => {
  // 버튼 클릭했을 때 화면 이동
  const Navigate = useNavigate();
  // Ref를 사용하여 Signaturecanvas 컴포넌트에 접근한다.
  const signatureCanvasRef = useRef(null);
  //그림 저장 상태
  const [savedSignatures, setSavedSignatures] = useState([]);
  const [canvasData, setCanvasData] = useState("");
  //각 버튼 클릭시 버튼 변경
  //const [isButtonClicked, setIsButtonClicked] = useState(false);
  // //그림판 구현
  const [canvasSize, setCanvasSize] = useState({ width: 50, height: 50 });
  const [color, setColor] = useState("black");
  //hover
  // const [isHovered, setIsHovered] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState("Ppencil");

  const [hoverGpencil, setHoverGpencil] = useState(false);
  const [hoverGeraser, setHoverGeraser] = useState(false);
  const [hoverGtrash, setHoverGtrash] = useState(false);

  //fileupload에서 받은 데이터를 다시 넣기 위한 부분
  const [pictureRequestData, setPictureRequestData] = useState([]);

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

  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if (!isLoggedIn) {
    Navigate("/");
  }

  useEffect(() => {
    // 페이지 컴포넌트가 마운트되면 body 태그에 클래스를 추가
    document.body.classList.add("draw-page-style");

    // 컴포넌트 언마운트 시 클래스 제거
    return () => {
      document.body.classList.remove("draw-page-style");
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log("Modal is open");
      const imgData = prevUrl[content.toUpperCase()];
      if (imgData) {
        const img = new Image();
        img.src = imgData;

        img.onload = () => {
          const canvas = signatureCanvasRef.current.getCanvas();
          const context = canvas.getContext("2d");

          // 캔버스를 비우고, 이미지 크기 조정 후 그리기
          context.clearRect(0, 0, canvas.width, canvas.height);
          // 이미지의 크기를 조정하여 캔버스에 그리기
          const scaleWidth = canvas.width;
          const scaleHeight = canvas.height;
          context.drawImage(img, 0, 0, scaleWidth, scaleHeight);
        };
      }
    }
    // 페이지 컴포넌트가 마운트되면 body 태그에 클래스를 추가
  }, [isOpen]);

  useEffect(() => {
    // 캔버스 배경을 흰색으로 설정
    if (signatureCanvasRef.current) {
      // Ref가 세팅된 후에 접근
      const canvas = signatureCanvasRef.current.getCanvas();
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF"; // 흰색 배경 설정
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    // 윈도우 리사이즈 이벤트에 반응하여 캔버스를 다시 초기화
    const initializeCanvas = () => {
      if (signatureCanvasRef.current) {
        const canvas = signatureCanvasRef.current.getCanvas();
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener("resize", initializeCanvas);

    // 컴포넌트 마운트 시 초기화 수행
    initializeCanvas();

    return () => {
      window.removeEventListener("resize", initializeCanvas);
    };
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("canvasData");
    if (savedData) {
      const img = new Image();
      img.src = savedData;
      img.onload = () => {
        if (signatureCanvasRef.current) {
          // 레퍼런스가 유효한지 확인
          const canvas = signatureCanvasRef.current.getCanvas();
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 이미지를 캔버스 크기에 맞게 그립니다.
        }
      };
    }
  }, []);

  useEffect(() => {
    //컴포넌트가 언마운트 되거나 창 크기가 변경 되기 전에 로컬 스토리지에 저장
    const saveCanvasData = () => {
      if (signatureCanvasRef.current) {
        const dataUrl = signatureCanvasRef.current.toDataURL();
        localStorage.setItem("canvasData", dataUrl);
        console.log("Saved image to localStorage:", dataUrl); // 로그 추가
      }
    };

    // window.addEventListener('beforeunload', saveCanvasData);
    window.addEventListener("resize", saveCanvasData);

    return () => {
      // window.removeEventListener('beforeunload', saveCanvasData);
      window.removeEventListener("resize", saveCanvasData);
    };
  }, []);

  //서버에 전송후 토큰 삭제
  const handleClear = () => {
    if (signatureCanvasRef.current) {
      // null 체크 추가
      signatureCanvasRef.current.clear();
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  // 그림판 초기화: 펜 색상과 크기를 설정
  useEffect(() => {
    console.log("Default pencil is set");
    setColor("black"); // 펜 색상을 검정색으로 설정
    setPenSize(1); // 펜 크기를 1로 설정
    // 이후 필요한 추가 초기화 작업을 수행할 수 있습니다.
  }, []);

  useEffect(() => {
    handleClick("Gpencil"); // 컴포넌트 마운트 시 연필 도구 활성화
  }, []);

  // 펜의 최소 두께와 최대 두께
  const minPenSize = 1;
  const maxPenSize = 10;

  // 펜 사이즈 상태
  const [penSize, setPenSize] = useState({
    minWidth: minPenSize,
    maxWidth: maxPenSize,
  });

  const changePenSize = (maxPenSize) => {
    setPenSize(maxPenSize);
  };

  const handleClick = (buttonName) => {
    setIsButtonClicked(buttonName === isButtonClicked ? null : buttonName); // 현재 클릭된 버튼이면 상태를 null로 변경하고 아니면 버튼 이름으로 변경
    if (buttonName === "Gtrash") {
      handleClear(); // 클릭 시 지우기 기능 호출
    }
  };

  // ref가 잘 작동되는지 콘솔을 찍어봄
  useEffect(() => {
    if (signatureCanvasRef.current) {
      console.log("Ref is set", signatureCanvasRef.current);
      try {
        // const ctx = signatureCanvasRef.current.getContext('2d');
        console.log("Context is accessible");
      } catch (error) {
        console.error("Failed to get context", error);
      }
    } else {
      console.error("Ref is not set");
    }
  }, []);

  //캔버스를 벗어날때 캔버스 초기화
  useEffect(() => {
    const clearCanvas = () => {
      if (signatureCanvasRef.current) {
        signatureCanvasRef.current.clear();
      }
    };

    const handleBeforeUnload = () => {
      clearCanvas();
      localStorage.removeItem("canvasData"); // 페이지를 벗어나면 로컬 스토리지에서 캔버스 데이터를 제거합니다.
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleResize = () => {
    if (signatureCanvasRef.current) {
      const canvasElement = signatureCanvasRef.current.getCanvas(); // 실제 canvas 요소를 가져옵니다.
      const ctx = canvasElement.getContext("2d"); // 이제 getContext를 호출할 수 있습니다.

      // 임시 캔버스를 생성하고, 기존 캔버스의 내용을 임시 캔버스에 복사합니다.
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvasElement.width;
      tempCanvas.height = canvasElement.height;
      tempCtx.drawImage(canvasElement, 0, 0); // 기존 캔버스의 내용을 임시 캔버스에 복사

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      let newWidth, newHeight;

      // 기존 캔버스의 이미지 데이터를 임시 변수에 저장
      const tempImage = new Image();
      tempImage.src = canvasElement.toDataURL(); // 이미지 데이터 URL 생성

      if (screenWidth < 768) {
        newWidth = 200;
        newHeight = 200;
      } else if (768 <= screenWidth && screenWidth < 1500) {
        newWidth = 300;
        newHeight = 300;
      } else {
        newWidth = 500;
        newHeight = 550;
        if (newHeight > screenHeight * 0.5) {
          newHeight = screenHeight * 0.5;
          newWidth = newHeight * 1;
        }
      }

      // 기존 캔버스의 이미지를 새로운 크기의 캔버스에 그리기
      tempImage.onload = () => {
        ctx.drawImage(tempImage, 0, 0, newWidth, newHeight); // 새로운 크기의 캔버스에 이미지 그리기
      };
    }

    // 그림 저장
    if (signatureCanvasRef.current) {
      const dataURL = signatureCanvasRef.current.toDataURL();
      setCanvasData(dataURL);
      setSavedSignatures([...savedSignatures, dataURL]);
      localStorage.setItem("canvasData", dataURL); // 로컬 스토리지에 저장
    }
  };

  useEffect(() => {
    // 크기 변경 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    const checkSize = () => {
      let width, height;

      if (window.innerWidth < 768) {
        // 가정: 768px 미만은 모바일로 간주
        width = 310;
        height = 310;
      } else if (768 <= window.innerWidth && window.innerWidth < 1500) {
        width = 624;
        height = 426;
      } else {
        width = 624;
        height = 426;
      }
      setCanvasSize({ width, height });
    };

    handleResize(); // 초기 캔버스 크기 조정
    checkSize(); // 컴포넌트 마운트 시 실행

    window.addEventListener("resize", handleResize); // 창 크기 변경 시 실행
    window.addEventListener("resize", checkSize); // 창 크기 변경 시 실행

    return () => {
      window.removeEventListener("resize", handleResize); // 클린업
      window.removeEventListener("resize", checkSize); // 클린업
    };
  }, []);

  // useEffect를 사용하여 컴포넌트가 마운트될 때 토큰을 가져옵니다.
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setjwtToken(token);
  }, []);

  const [jwtToken, setjwtToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 로컬 스토리지에 저장
    const saveCanvasData = () => {
      if (signatureCanvasRef.current) {
        const dataUrl = signatureCanvasRef.current.toDataURL();
        localStorage.setItem("canvasData", dataUrl);
        console.log("Saved image to localStorage:", dataUrl);
      }
    };

    window.addEventListener("beforeunload", saveCanvasData);
    window.addEventListener("resize", saveCanvasData);
    return () => {
      window.removeEventListener("beforeunload", saveCanvasData);
      window.removeEventListener("resize", saveCanvasData);
    };
  }, []);

  // 데이터 url blob로 변화하기
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // const uploadImageToServer = async () => {
  //   // const token = localStorage.getItem('jwtToken');
  //   if (!jwtToken) {
  //     console.error("인증권한 없음");
  //     return;
  //   }

  //   console.log("JWT Token:", jwtToken);

  //   if (signatureCanvasRef.current) {
  //     const canvas = signatureCanvasRef.current.getCanvas();
  //     let imageData = canvas.toDataURL("image/png"); // 원본 이미지 데이터

  //     // 화면 크기가 768px 미만인 경우, 이미지 크기를 조정합니다.
  //     if (window.innerWidth < 768) {
  //       // 원본 캔버스에서 이미지를 크게 조정
  //       imageData = resizeCanvasImage(canvas, 500, 500, "white"); // 모바일에서는 800x600 크기로 조정
  //     }

  //     const blob = dataURLtoBlob(imageData);
  //     console.log(blob); // Blob 데이터 확인
  //     const formData = new FormData();
  //     formData.append("file", blob, "image.png");
  //     formData.append("pictureType", JSON.stringify({ pictureType: "HOUSE" })); // pictureType을 JSON 객체로 추가

  //     // FormData 내용 로그 출력
  //     for (let [key, value] of formData.entries()) {
  //       console.log(`${key}: ${value}`);
  //     }

  //     // 이미지 파일 크기 로그 출력
  //     console.log("이미지 파일 크기:", blob.size, "bytes");

  //     console.log("Sending POST request to server with form data:");
  //     setIsLoading(true);

  //     try {
  //       const response = await fetch(
  //         "https://dev.catchmind.shop/api/picture/recognition",
  //         {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${jwtToken}`,
  //           },
  //           body: formData,
  //         }
  //       );

  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         console.error(
  //           `HTTP error! status: ${response.status}, message: ${errorText}`
  //         );
  //         throw new Error(
  //           `HTTP error! status: ${response.status}, message: ${errorText}`
  //         );
  //       }

  //       let data = await response.json();
  //       console.log("File upload successful:", data);
  //       //TODO => 이부분 에러남
  //       handleClear(); // 이미지 업로드 후 캔버스 클리어
  //     } catch (error) {
  //       console.error("File upload failed:", error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  // 이미지 크기 조정을 위한 함수
  // function resizeCanvasImage(
  //   originalCanvas,
  //   targetWidth,
  //   targetHeight,
  //   backgroundColor = "white"
  // ) {
  //   const tempCanvas = document.createElement("canvas");
  //   const tempCtx = tempCanvas.getContext("2d");
  //   tempCanvas.width = targetWidth;
  //   tempCanvas.height = targetHeight;
  //   // 배경색 설정
  //   tempCtx.fillStyle = backgroundColor;
  //   tempCtx.fillRect(0, 0, targetWidth, targetHeight);
  //   tempCtx.drawImage(
  //     originalCanvas,
  //     0,
  //     0,
  //     originalCanvas.width,
  //     originalCanvas.height,
  //     0,
  //     0,
  //     targetWidth,
  //     targetHeight
  //   );
  //   return tempCanvas.toDataURL("image/png");
  // }

  const handleDoneClick = async () => {
    console.log("완료 버튼 클릭");
    console.log("------------------------");
    console.log(pictureType);
    console.log("------------------------");
    console.log(content);

    if (signatureCanvasRef.current) {
      const imageData = signatureCanvasRef.current.toDataURL("image/png");
      const blob = dataURLtoBlob(imageData);

      // 그림 데이터를 서버로 전송
      const formData = new FormData();
      formData.append("file", blob, "image.png");
      formData.append(
        "pictureType",
        JSON.stringify({ pictureType: content.toUpperCase() })
      );

      // Blob URL 생성 및 미리보기 설정
      const blobUrl = URL.createObjectURL(blob);
      //console.log(blobUrl); // Blob URL이 제대로 생성되는지 확인
      setPreviewUrls((prev) => ({
        ...prev,
        [content]: blobUrl,
      }));

      // 이미지 파일 크기 로그 출력
      console.log("이미지 파일 크기:", blob.size, "bytes");

      try {
        const response = await fetch(
          "https://dev.catchmind.shop/api/picture/recognition",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Recognition 응답 성공:", data);

          // Recognition 응답 데이터를 부모 컴포넌트로 전달하여 처리
          handleRecognitionResponse(data, content.toUpperCase(), imageData); // 예: HOUSE 그림에 대한 응답 처리

          // value 값이 문자열인지 확인
          const value = data.value; // 적절한 필드를 확인하세요
          console.log("Value:", value); // value 내용 확인
          console.log("Value type:", typeof value); // value 타입 확인 (여기서 'string'으로 나와야 함)
          // pictureType과 응답 데이터의 특정 필드를 value로 추가
          console.log(disabledImages);
          // setPictureRequestData((prevData) => [
          //   ...prevData,
          //   {
          //     pictureType: content, // 이미지 타입 (예: HOUSE, TREE, MALE, FEMALE)
          //     value: value || "", // 서버 응답 데이터에서 필요한 필드 (예: 값이 들어가야 할 필드)
          //   },
          // ]);

                          // 업데이트 로직
                          setPictureRequestData((prevData) => {
                            const newData = [...prevData];
                            const index = newData.findIndex(item => item.pictureType === content.toUpperCase());
                            if (index !== -1) {
                                newData[index] = {
                                    pictureType: content.toUpperCase(),
                                    value: data.value || "", // 적절한 데이터 필드 사용
                                };
                            } else {
                                newData.push({
                                    pictureType: content.toUpperCase(),
                                    value: data.value || "",
                                });
                            }
                            return newData;
                        });

  //         // 빈 값 또는 공백 문자열에 대한 처리
  //         if (!value || value.trim() === "") {
  //           console.log(`"${content}"의 인식 결과가 없습니다. 활성화 합니다.`);
  //           setDisabledImages((prev) => ({ ...prev, [content]: false }));
  //         } else {
  //           console.log("Value:", value);
  //           console.log(
  //             `"${content}"의 인식 결과가 있습니다. 비활성화 합니다.`
  //           );
  //           setDisabledImages((prev) => ({ ...prev, [content]: true }));
  //           console.log("======================");
  //           console.log(disabledImages);
  //           console.log("======================");
  //         }
  //       } else {
  //         console.error("Recognition 요청 실패:", await response.text());
  //       }
  //     } catch (error) {
  //       console.error("Recognition 요청 오류:", error.message);
  //     }

  //     onClose(); // 모달 창 닫기
  //     // setIsButtonEnabled(disabledImages[ContentType.HOUSE] &disabledImages[ContentType.TREE] &disabledImages[ContentType.MALE] &disabledImages[ContentType.FEMALE] )
  //     console.log(content.toUpperCase());
  //   }
  // };

  // 인식 결과가 없을 경우의 처리
  if (!data.value || data.value.trim() === "") {
    console.log(`"${content.toUpperCase()}"의 인식 결과가 없습니다. 활성화 합니다.`);
    setDisabledImages((prev) => ({ ...prev, [content.toUpperCase()]: false }));
} else {
    console.log("Value:", data.value);
    console.log(`"${content.toUpperCase()}"의 인식 결과가 있습니다. 비활성화 합니다.`);
    setDisabledImages((prev) => ({ ...prev, [content.toUpperCase()]: true }));
}
} else {
console.error("Recognition 요청 실패:", await response.text());
}
} catch (error) {
console.error("Recognition 요청 오류:", error.message);
}

onClose(); // 모달 창 닫기
}
};

  const ContentType = {
    HOUSE: "HOUSE",
    TREE: "TREE",
    MALE: "MALE",
    FEMALE: "FEMALE",
  };

  const getContent = () => {
    switch (content) {
      case ContentType.HOUSE:
        return <Text>&quot;집&quot;을 그려주세요</Text>;
      case ContentType.TREE:
        return <Text>&quot;나무&quot;를 그려주세요</Text>;
      case ContentType.MALE:
        return <Text>&quot;남자 사람&quot;을 그려주세요</Text>;
      case ContentType.FEMALE:
        return <Text>&quot;여자 사람&quot;을 그려주세요</Text>;
      default:
        return <Text>내용을 선택해주세요</Text>;
    }
  };

  // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Text>{getContent()}</Text>

        {/* <>
          {isLoading ? (
            <Loading />
          ) : ( */}
        <Wrap className="scrollContainer">
          <OutContainer>
            <DrawingArea>
              <CanvasContainer
                style={{
                  width: `${canvasSize.width}px`,
                  height: `${canvasSize.height}px`,
                }}
              >
                {/* <CanvasContainer> */}
                <SignatureCanvas
                  ref={signatureCanvasRef}
                  backgroundColor="white"
                  penColor={color}
                  penSize={penSize} // penSize 상태를 전달
                  canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                  }}
                  // 서명이 완료될때마다 저장된다.
                  onEnd={() => {
                    // 자동으로 저장됩니다.
                    const dataURL = signatureCanvasRef.current.toDataURL();
                    setCanvasData(dataURL);
                    setSavedSignatures([...savedSignatures, dataURL]);
                  }}
                  onMouseDown={() => {
                    if (canvasContentState) {
                      const ctx = signatureCanvasRef.current.getContext("2d");
                      const img = new Image();
                      img.onload = function () {
                        ctx.drawImage(img, 0, 0);
                      };
                      img.src = canvasContentState;
                    }
                  }}
                  minWidth={penSize} // 펜의 최소 두께
                  maxWidth={penSize} // 펜의 최대 두께
                />
              </CanvasContainer>
              <Icon>
                {/* WPencil 버튼 */}
                {isButtonClicked != "Gpencil" ? (
                  <WStyledWrapper>
                    <Gpencil
                      onMouseEnter={() => setHoverGpencil(true)}
                      onMouseLeave={() => setHoverGpencil(false)}
                      onClick={() => {
                        handleClick("Ppencil");
                        handleColorChange("black");
                        changePenSize(minPenSize);
                      }}
                    />
                  </WStyledWrapper>
                ) : (
                  <BStyledWrapper>
                    <Ppencil
                      onMouseEnter={() => setHoverGpencil(true)}
                      onMouseLeave={() => setHoverGpencil(false)}
                      onClick={() => handleClick("Gpencil")}
                    />
                  </BStyledWrapper>
                )}
                {hoverGpencil && <DrawStyle />}

                {/* BEraser 버튼 */}
                {isButtonClicked != "Geraser" ? (
                  <WStyledWrapper>
                    <Geraser
                      onMouseEnter={() => setHoverGeraser(true)}
                      onMouseLeave={() => setHoverGeraser(false)}
                      onClick={() => {
                        handleClick("Geraser");
                        handleColorChange("white");
                        changePenSize(maxPenSize);
                      }}
                    />
                  </WStyledWrapper>
                ) : (
                  <BStyledWrapper>
                    <Peraser
                      onMouseEnter={() => setHoverGeraser(true)}
                      onMouseLeave={() => setHoverGeraser(false)}
                      onClick={() => handleClick("Geraser")}
                    />
                  </BStyledWrapper>
                )}
                {hoverGeraser && <EraseAllStyle />}

                {/* BTrash 버튼 */}
                {isButtonClicked != "Gtrash" ? (
                  <WStyledWrapper>
                    <Gtrash
                      onMouseEnter={() => setHoverGtrash(true)}
                      onMouseLeave={() => setHoverGtrash(false)}
                      onClick={() => handleClick("Gtrash")}
                    />
                  </WStyledWrapper>
                ) : (
                  <BStyledWrapper>
                    <Ptrash
                      onMouseEnter={() => setHoverGtrash(true)}
                      onMouseLeave={() => setHoverGtrash(false)}
                      onClick={() => handleClick("Gtrash")}
                    />
                  </BStyledWrapper>
                )}
                {hoverGtrash && <ErasePartStyle />}
              </Icon>
            </DrawingArea>
          </OutContainer>
        </Wrap>
        {/* // )}
        // </> */}

        <ButtonBox>
          <GoBackBox onClick={onClose}>
            <GoBackButton>나가기</GoBackButton>
          </GoBackBox>

          <DoneBox onClick={handleDoneClick}>
            <DoneButton>완료</DoneButton>
          </DoneBox>
        </ButtonBox>
      </ModalContent>
    </ModalContainer>
  );
};

DrawModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleRecognitionResponse: PropTypes.func.isRequired,
  setPreviewUrls: PropTypes.func.isRequired,
  pictureType: PropTypes.string.isRequired,
  prevUrl: PropTypes.object.isRequired,
  setDisabledImages: PropTypes.func.isRequired,
  disabledImages: PropTypes.object.isRequired,
};

export default DrawModal;

const ModalContainer = styled.div`
  position: fixed;
  width: 100%;
  // height: 93%;
  height: 110%;
  background: rgba(39, 40, 43, 0.3); // 전체 배경에 반투명 색상 적용
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; // 충분히 높은 z-index를 설정하여 다른 요소 위에 표시
`;

const ModalContent = styled.div`
  width: 58rem; // 928px;
  height: 42rem; // 672px;
  border-radius: 0.625rem; // 10px;
  background: #fff;
  z-index: 2; // ModalContainer 안에서 상위에 위치
  position: relative; // fixed 대신 relative로 변경
  display: flex;
  flex-direction: column; // 내부 요소를 세로로 정렬
`;

const Text = styled.div`
  color: #27282b;
  text-align: center;
  font-family: Pretendard-Regular;
  font-size: 1.625rem; //26px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 39px */
  margin-top: 1rem;
  margin-bottom: 0.5rem;

  ${theme.media.mobile`
    font-size: 0.875rem;
  `}
`;

const Wrap = styled.div`
  display: flex;
  /* 컨테이너 사이의 여백을 최대로 확보하여 내부 요소를 양쪽으로 분산 배치 */

  ${theme.media.mobile`
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  `}

  ${theme.media.desktop`
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 99;
  //여기 변경
  flex-direction: row-reverse;
  justify-content: center;

  `}
`;

const OutContainer = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1.875rem; // 30px;
  display: flex;
  left: 0;
  z-index: 0;

  ${theme.media.mobile`

  padding-top: 10rem;
  position: relative;
  z-index: 0;
  gap: 0.5rem; // 30px;
  height: auto; // 모바일에서는 내용에 따라 높이 자동 조정
  overflow-y: auto; // 내용이 넘칠 경우 세로 스크롤 허용
  z-index: 0;
  `}
`;

const Icon = styled.div`
  left: 13.1875rem; //211px;
  top: 7.25rem; //116px;
  display: flex;
  flex-direction: column;
  margin-left: 0.625rem;
  align-items: center;

  ${theme.media.mobile`
  flex-direction: row;
  margin-top: 1.25rem;
`}
`;

const DrawingArea = styled.div`
  left: 15.1875rem; //211px;
  top: 7.25rem; //116px;
  display: flex;

  //다시 설정
  // width: 100%; /* 너비를 부모 요소에 맞게 설정 */
  // height: 60vh; /* 높이를 화면 높이의 60%로 설정 */

  // width: ${({ canvasWidth }) => canvasWidth}px;
  // height: ${({ canvasHeight }) => canvasHeight}px;

  ${theme.media.mobile`
  flex-direction: column-reverse;
  display: fixed;
`}

  ${theme.media.desktop`
  margin-right: 3.5rem;

`}
`;

const CanvasContainer = styled.div`
  width: ${({ canvasWidth }) => canvasWidth}px;
  height: ${({ canvasHeight }) => canvasHeight}px;
  background: white;
  border: 0.0625rem solid #e0e1e9;
  border-radius: 0.625rem;
  margin-bottom: 1.85rem;
  padding: 0.625rem;
  margin-left: 7rem;

  /* DrawingArea 내에서 공간을 균등하게 분배하여 CanvasContainer가 DrawingArea 크기에 따라 변하도록 함 */
  flex: 1;

  ${theme.media.mobile`
  `}
`;

// 스타일 컴포넌트 정의
const WStyledWrapper = styled.div`
  background: white;
  border-radius: 18.75rem; //300px;
  justify-content: center;
  align-items: center;
  gap: 0.625rem; //10px;
  display: inline-flex;
  margin-right: 1.25rem; //20px;
  margin-bottom: 1rem; //16px;
  cursor: pointer;

  ${theme.media.mobile`
  `}
`;

const BStyledWrapper = styled.div`
  background: #6487e2;
  box-shadow: 0rem 0.25rem 0.25rem rgba(39, 40, 43, 0.1);
  border-radius: 18.75rem; //300px;
  justify-content: center;
  align-items: center;
  gap: 0.625rem; //10px;
  display: inline-flex;
  margin-right: 1.25rem; //20px;
  margin-bottom: 1rem; //16px;

  ${theme.media.mobile`
  `}
`;

const GoBackBox = styled.div`
  width: 8rem; //160px;
  height: 2.75rem; //44px;
  padding: 0 1.25rem; //0 20px;
  background: white;
  border-radius: 0.25rem; //4px;
  border: 0.0625rem solid #9386e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.625rem;
  margin-left: 0.28rem;
`;

const GoBackButton = styled.button`
  width: 10rem; //120px;
  text-align: center;
  color: #9386e0;
  font-size: 1rem; //16px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 1.5rem; //24px;
  word-wrap: break-word;
  border: none;
  background: none;
  cursor: pointer;
`;

const DoneBox = styled.div`
  width: 8rem; //160px;
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
`;

const DoneButton = styled.button`
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

const ButtonBox = styled.div`
  display: flex;
  gap: 1.25rem; //20px; /* 버튼 간격 */
  justify-content: center;
  align-items: center;
`;

const DrawStyle = styled(Draw)`
  position: absolute;
  z-index: 100; // 다른 요소들보다 높은 값
  right: 9rem; // 오른쪽으로부터 20px
`;

const EraseAllStyle = styled(EraseAll)`
  position: absolute;
  z-index: 100; // 다른 요소들보다 높은 값
  right: 9rem; // 오른쪽으로부터 20px
  top: 3.5rem;
`;

const ErasePartStyle = styled(ErasePart)`
  position: absolute;
  z-index: 100; // 다른 요소들보다 높은 값
  right: 9rem; // 오른쪽으로부터 20px
  top: 7rem;
`;
