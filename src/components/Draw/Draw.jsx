// import React, { useRef, useState, useEffect} from 'react';
// import SignatureCanvas from 'react-signature-canvas';
// import { useNavigate } from 'react-router-dom';
// import { ReactComponent as WEraser } from '../../assets/Draw/WEraser.svg';
// import { ReactComponent as WPencil } from '../../assets/Draw/WPencil.svg';
// import { ReactComponent as WTrash } from '../../assets/Draw/WTrash.svg';
// import { ReactComponent as BEraser } from '../../assets/Draw/BEraser.svg';
// import { ReactComponent as BPencil } from '../../assets/Draw/BPencil.svg';
// import { ReactComponent as BTrash } from '../../assets/Draw/BTrash.svg';
// import { Wrap, OutContainer, Icon, DrawingArea, CanvasContainer, ButtonContainer, Button } from './DrawStyle';
// import { WStyledWrapper, BStyledWrapper} from './DrawStyle';
// import {} from 'recoil';
// import { atom } from 'recoil';
// import Loading from '../Draw/Loading';
// import { useRecoilState } from 'recoil';
// import { LoginState } from '../../recoil/recoilState';
// import styled from 'styled-components';

// // Recoil을 사용하여 캔버스의 내용을 상태로 관리
// const canvasContentState = atom({
//   key: 'canvasContentState',
//   default: null,
// });

// // default 값이 type 이 default
// WPencil.defaultProps = {
//   type: "default",
// };


// function Draw() {  

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');

//   // 버튼 클릭했을 때 화면 이동
//   const Navigate = useNavigate();

//   // 로그인 상태
//   const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
//   if(!isLoggedIn){
//     Navigate('/');
//   }

//   useEffect(() => {
//     // 페이지 컴포넌트가 마운트되면 body 태그에 클래스를 추가
//     document.body.classList.add('draw-page-style');

//     // 컴포넌트 언마운트 시 클래스 제거
//     return () => {
//       document.body.classList.remove('draw-page-style');
//     };
//   }, []);

//   // Ref를 사용하여 Signaturecanvas 컴포넌트에 접근한다.
//   const signatureCanvasRef = useRef(null);
//   //그림 저장 상태
//   const [savedSignatures, setSavedSignatures] = useState([]);
//   const [canvasData, setCanvasData] = useState('');

//   // 흰색 배경
//   useEffect(() => {
//     // 캔버스 배경을 흰색으로 설정
//     const canvas = signatureCanvasRef.current.getCanvas();
//     const ctx = canvas.getContext('2d');
//     ctx.fillStyle = '#FFFFFF'; // 흰색 배경 설정
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // 이 후의 그림 그리기는 흰색 배경 위에 수행
//   }, []);


//   //흰색 배경 유지 코드 추가
//   useEffect(() => {
//     const canvas = signatureCanvasRef.current.getCanvas();
//     const ctx = canvas.getContext('2d');
  
//     // 캔버스 초기화 및 배경 설정 함수
//     function initializeCanvas() {
//       ctx.fillStyle = '#FFFFFF';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//     }
  
//     // 윈도우 리사이즈 이벤트에 반응하여 캔버스를 다시 초기화
//     window.addEventListener('resize', initializeCanvas);
  
//     // 컴포넌트 마운트 시 초기화 수행
//     initializeCanvas();
  
//     return () => {
//       window.removeEventListener('resize', initializeCanvas);
//     };
//   }, []);
  



//   useEffect(() => {
//     const savedData = localStorage.getItem('canvasData');
//     if (savedData) {
//       setCanvasData(savedData);
//       const img = new Image();
//       img.onload = () => {
//         const canvas = signatureCanvasRef.current.getCanvas();
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 이미지를 캔버스 크기에 맞게 그립니다.
//       };
//       img.src = savedData;
//     }
//   }, []);


//   useEffect(() => {
//     //컴포넌트가 언마운트 되거나 창 크기가 변경 되기 전에 로컬 스토리지에 저장
//     const saveCanvasData = () => {
//       if(signatureCanvasRef.current){
//         const dataUrl = signatureCanvasRef.current.toDataURL();
//         localStorage.setItem('canvasData', dataUrl);
//         console.log('Saved image to localStorage:', dataUrl); // 로그 추가
//       }
//     };

//    // window.addEventListener('beforeunload', saveCanvasData);
//     window.addEventListener('resize', saveCanvasData);

//     return () => {
//      // window.removeEventListener('beforeunload', saveCanvasData);
//       window.removeEventListener('resize', saveCanvasData);
//     };
//   }, []);

  


//   //토글 구현
//   const [isDescriptionVisible, setDescriptionVisible] = useState(false)


//   //Description <-> Bar 토글 버튼 클릭 시 상태 변경
//   const toggleDescription = () => {
//     setDescriptionVisible(!isDescriptionVisible);
//   };

//   // BarBox 클릭 시 Description 토글
//   const toggleBarBox = () => {
//     setDescriptionVisible(!isDescriptionVisible);
//   };

//   //각 버튼 클릭시 버튼 변경
//   const [isButtonClicked, setIsButtonClicked] = useState(false);

//     //서버에 전송후 토큰 삭제
//     const handleClear = () => {
//       if (signatureCanvasRef.current) { // null 체크 추가
//         signatureCanvasRef.current.clear();
//       }
//     };

//   const handleColorChange = (newColor) => {
//     setColor(newColor);
//   };

//   // 그림판 초기화: 펜 색상과 크기를 설정
//   useEffect(() => {
//     if (signatureCanvasRef.current) {
//       console.log('Default pencil is set');
//       setColor('black'); // 펜 색상을 검정색으로 설정
//       setPenSize(1); // 펜 크기를 1로 설정
//       // 이후 필요한 추가 초기화 작업을 수행할 수 있습니다.
//     }
//   }, []);


//   useEffect(() => {
//     handleClick('WPencil'); // 컴포넌트 마운트 시 연필 도구 활성화
//   }, []);

//   // 펜의 최소 두께와 최대 두께
//   const minPenSize = 1;
//   const maxPenSize = 10;

//   // 펜 사이즈 상태
//   const [penSize, setPenSize] = useState({ minWidth: minPenSize, maxWidth: maxPenSize });

//   const changePenSize = (maxPenSize) => {
//     setPenSize(maxPenSize);
//   };

//   const handleClick = (buttonName) => {
//     setIsButtonClicked(buttonName === isButtonClicked ? null : buttonName); // 현재 클릭된 버튼이면 상태를 null로 변경하고 아니면 버튼 이름으로 변경
//     if (buttonName === 'WTrash') {
//       handleClear(); // 클릭 시 지우기 기능 호출
//     } 
//   };

//     // //그림판 구현
//     const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
//     const [color, setColor] = useState("black");

//     // ref가 잘 작동되는지 콘솔을 찍어봄
//     useEffect(() => {
//     if (signatureCanvasRef.current) {
//       console.log("Ref is set", signatureCanvasRef.current);
//       try {
//         // const ctx = signatureCanvasRef.current.getContext('2d');
//         console.log("Context is accessible");
//       } catch (error) {
//         console.error("Failed to get context", error);
//       }
//     } else {
//       console.error("Ref is not set");
//     }
//   }, []);


//   //캔버스를 벗어날때 캔버스 초기화
//   useEffect(() => {
//     const clearCanvas = () => {
//       if (signatureCanvasRef.current) {
//         signatureCanvasRef.current.clear();
//       }
//     };
  
//     const handleBeforeUnload = () => {
//       clearCanvas();
//       localStorage.removeItem('canvasData'); // 페이지를 벗어나면 로컬 스토리지에서 캔버스 데이터를 제거합니다.
//     };
  
//     window.addEventListener('beforeunload', handleBeforeUnload);
  
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);
  

// useEffect(() => {


//     const handleResize = () => {
//     if (signatureCanvasRef.current) {
//       const canvasElement = signatureCanvasRef.current.getCanvas(); // 실제 canvas 요소를 가져옵니다.
//       const ctx = canvasElement.getContext('2d'); // 이제 getContext를 호출할 수 있습니다.

//       // 임시 캔버스를 생성하고, 기존 캔버스의 내용을 임시 캔버스에 복사합니다.
//       const tempCanvas = document.createElement('canvas');
//       const tempCtx = tempCanvas.getContext('2d');
//       tempCanvas.width = canvasElement.width;
//       tempCanvas.height = canvasElement.height;
//       tempCtx.drawImage(canvasElement, 0, 0); // 기존 캔버스의 내용을 임시 캔버스에 복사

//       const screenWidth = window.innerWidth;
//       const screenHeight = window.innerHeight;
//       let newWidth, newHeight;


//   // 기존 캔버스의 이미지 데이터를 임시 변수에 저장
//   const tempImage = new Image();
//   tempImage.src = canvasElement.toDataURL(); // 이미지 데이터 URL 생성


//       if (screenWidth < 768) {
//         newWidth = 310;
//         newHeight = 310;
//       } else if(768 <= screenWidth && screenWidth < 1500){
//         newWidth = 570;
//         newHeight = 400;
//       }else {
//         newWidth = 1000;
//         newHeight = 550;
//         if (newHeight > screenHeight * 0.6) {
//           newHeight = screenHeight * 0.6;
//           newWidth = newHeight * 1;
//         }
//       }

//     // 기존 캔버스의 이미지를 새로운 크기의 캔버스에 그리기
//     tempImage.onload = () => {
//       ctx.drawImage(tempImage, 0, 0, newWidth, newHeight); // 새로운 크기의 캔버스에 이미지 그리기
//     };
//     }

//     // 그림 저장
//     if (signatureCanvasRef.current) {
//       const dataURL = signatureCanvasRef.current.toDataURL();
//       setCanvasData(dataURL);
//       setSavedSignatures([...savedSignatures, dataURL]);
//       localStorage.setItem('canvasData', dataURL); // 로컬 스토리지에 저장
//     }
//   };

//   // 크기 변경 이벤트 리스너 등록
//   window.addEventListener('resize', handleResize);


//   const checkSize = () => {
//     let width, height;

//   if (window.innerWidth < 768) { // 가정: 768px 미만은 모바일로 간주
//     width = 310;
//     height = 310;
//   } else if(768 <= window.innerWidth && window.innerWidth < 1500){
//     width = 570;
//     height = 400;
//   }else {
//     width = 1000;
//     height = 550;
//   }
//   setCanvasSize({ width, height });
// };

//   handleResize(); // 초기 캔버스 크기 조정
//   checkSize(); // 컴포넌트 마운트 시 실행

//   window.addEventListener('resize', handleResize); // 창 크기 변경 시 실행
//   window.addEventListener('resize', checkSize); // 창 크기 변경 시 실행

//   return () => {
//     window.removeEventListener('resize', handleResize); // 클린업
//     window.removeEventListener('resize', checkSize); // 클린업
//   };
// }, []);


//   // useEffect를 사용하여 컴포넌트가 마운트될 때 토큰을 가져옵니다.
//   useEffect(() => {
//     const token = localStorage.getItem('jwtToken');
//     setjwtToken(token);
//   }, []);

//   const [jwtToken, setjwtToken] = useState('');
//   const [isLoading, setIsLoading] = useState(false);


//   useEffect(() => {
//     // 컴포넌트가 언마운트될 때 로컬 스토리지에 저장
//     const saveCanvasData = () => {
//       if (signatureCanvasRef.current) {
//         const dataUrl = signatureCanvasRef.current.toDataURL();
//         localStorage.setItem('canvasData', dataUrl);
//         console.log('Saved image to localStorage:', dataUrl);
//       }
//     };

//     window.addEventListener('beforeunload', saveCanvasData);
//     window.addEventListener('resize', saveCanvasData);
//     return () => {
//       window.removeEventListener('beforeunload', saveCanvasData);
//       window.removeEventListener('resize', saveCanvasData);
//     };
//   }, []);

//   // 데이터 url blob로 변화하기
//   const dataURLtoBlob = (dataURL) => {
//     const byteString = atob(dataURL.split(',')[1]);
//     const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   };

// const uploadImageToServer = async () => {
//   const token = localStorage.getItem('jwtToken');
//   if (!token) {
//     console.error("JWT token not found in local storage");
//     return;
//   }

//   if (signatureCanvasRef.current) {
//     const canvas = signatureCanvasRef.current.getCanvas();
//     let imageData = canvas.toDataURL('image/png'); // 원본 이미지 데이터

//     // 화면 크기가 768px 미만인 경우, 이미지 크기를 조정합니다.
//     if (window.innerWidth < 768) {
//       // 원본 캔버스에서 이미지를 크게 조정
//       imageData = resizeCanvasImage(canvas, 500, 500, 'white'); // 모바일에서는 800x600 크기로 조정
//     }

//     const blob = dataURLtoBlob(imageData);
//     const formData = new FormData();
//     formData.append('file', blob, 'image.png');

//     console.log('Sending POST request to server with form data:');
//     setIsLoading(true);

//     try {
//       const response = await fetch('https://dev.catchmind.shop/api/picture', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       let data = await response.json();
//       console.log('File upload successful:', data);
//       Navigate('/result', { state: { response: data } });
//       handleClear(); // 이미지 업로드 후 캔버스 클리어
//     } catch (error) {
//       console.error('File upload failed:', error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }
// };

// // 이미지 크기 조정을 위한 함수
// function resizeCanvasImage(originalCanvas, targetWidth, targetHeight, backgroundColor='white') {
//   const tempCanvas = document.createElement('canvas');
//   const tempCtx = tempCanvas.getContext('2d');
//   tempCanvas.width = targetWidth;
//   tempCanvas.height = targetHeight;
//   // 배경색 설정
//   tempCtx.fillStyle = backgroundColor;
//   tempCtx.fillRect(0, 0, targetWidth, targetHeight);
//   tempCtx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height, 0, 0, targetWidth, targetHeight);
//   return tempCanvas.toDataURL('image/png');
// }


// const handleDoneClick = () => {
//   console.log('완료 버튼 클릭');
//   //addWhiteBack(signatureCanvasRef.current);
//   const imageData = signatureCanvasRef.current.toDataURL('image/png');
//     Navigate('/loading', { state: { imageData } });
//     uploadImageToServer(imageData); // 서버로 이미지 전송
//    // handleTokenClear(); //캔버스 토큰 삭제
//   uploadImageToServer(); // 서버로 이미지 전송
// };


//   return (

//     <>
//     {isLoading ? (
//         <Loading />
//       ) : (
//     <Wrap className="scrollContainer">
//       <OutContainer>
//           <DrawingArea>
//         <Icon>
//       {/* WPencil 버튼 */}
//       {isButtonClicked !== 'WPencil' ? (
//         <WStyledWrapper>
//           <WPencil onClick={() => {handleClick('WPencil'); handleColorChange('black'); changePenSize(minPenSize);}} />
//         </WStyledWrapper>
//       ) : (
//         <BStyledWrapper>
//           <BPencil onClick={() => handleClick('WPencil')} />
//         </BStyledWrapper>
//       )}

//       {/* BEraser 버튼 */}
//       {isButtonClicked !== 'WEraser' ? (
//         <WStyledWrapper>
//           <WEraser onClick={() => {handleClick('WEraser'); handleColorChange('white'); changePenSize(maxPenSize);}} />
//         </WStyledWrapper>
//       ) : (
//         <BStyledWrapper>
//           <BEraser onClick={() => handleClick('WEraser')} />
//         </BStyledWrapper>
//       )}

//       {/* BTrash 버튼 */}
//       {isButtonClicked !== 'WTrash' ? (
//         <WStyledWrapper>
//           <WTrash onClick={() => handleClick('WTrash')} />
//         </WStyledWrapper>
//       ) : (
//         <BStyledWrapper>
//           <BTrash onClick={() => handleClick('WTrash')} />
//         </BStyledWrapper>
//       )}
//         </Icon>
//             <CanvasContainer style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}>
//             {/* <CanvasContainer> */}
//             <SignatureCanvas
//                 ref={signatureCanvasRef}
//                 backgroundColor='white'
//                 penColor={color}
//                 penSize={penSize} // penSize 상태를 전달
//                 canvasProps={{ width: canvasSize.width, height: canvasSize.height }}
//                 // 서명이 완료될때마다 저장된다.
//                 onEnd={() => {
//                   // 자동으로 저장됩니다.
//                   const dataURL = signatureCanvasRef.current.toDataURL();
//                   setCanvasData(dataURL);
//                   setSavedSignatures([...savedSignatures, dataURL])
//                 }}
//                 onMouseDown={() => {
//                   if (canvasContentState) {
//                     const ctx = signatureCanvasRef.current.getContext('2d');
//                     const img = new Image();
//                     img.onload = function () {
//                       ctx.drawImage(img, 0, 0);
//                     };
//                     img.src = canvasContentState;
//                   }
//                 }}
//                 minWidth={penSize} // 펜의 최소 두께
//                 maxWidth={penSize} // 펜의 최대 두께
//             />
//             </CanvasContainer>
//         </DrawingArea>

//         <ButtonBox>
//         <GoBackBox>
//             <GoBackButton>나가기</GoBackButton>
//         </GoBackBox>

//         <DoneBox>
//             <DoneButton>완료</DoneButton>
//         </DoneBox>
//         </ButtonBox>

//       </OutContainer>
//     </Wrap>
//       )}
//       </>
//   );
// }

// export default Draw;

// export const GoBackBox = styled.div`
//   width: 8rem; //160px;
//   height: 2.75rem; //44px;
//   padding: 0 1.25rem; //0 20px;
//   background: white;
//   border-radius: 0.25rem; //4px;
//   border: 0.0625rem solid #9386E0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-bottom: 0.625rem;
//   margin-left: 0.28rem;
// `;

// export const GoBackButton = styled.button`
//   width: 10rem; //120px;
//   text-align: center;
//   color: #9386E0;
//   font-size: 1rem; //16px;
//   font-family: Pretendard-Regular;
//   font-weight: 700;
//   line-height: 1.5rem; //24px;
//   word-wrap: break-word;
//   border: none;
//   background: none;
//   cursor: pointer;
// `;

// export const DoneBox = styled.div`
//   width: 8rem; //160px;
//   height: 2.75rem; //44px;
//   padding: 0 1.25rem; //0 20px;
//   background: #9386E0;
//   border-radius: 0.25rem; //4px;
//   border: 0.0625rem solid #9386E0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-bottom: 0.625rem;
//   margin-left: 0.16rem;
// `;

// export const DoneButton = styled.button`
//   width: 7.5rem; //120px;
//   text-align: center;
//   color: white;
//   font-size: 1rem; //16px;
//   font-family: Pretendard-Regular;
//   font-weight: 700;
//   line-height: 1.5rem; //24px;
//   word-wrap: break-word;
//   border: none;
//   background: none;
//   cursor: pointer;
// `;

// export const ButtonBox = styled.div`
//   display: flex;
//   gap: 1.25rem; //20px; /* 버튼 간격 */
//   justify-content: center;
//   align-items: center;

// `;
