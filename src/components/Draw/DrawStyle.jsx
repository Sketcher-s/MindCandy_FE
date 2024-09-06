// import styled from 'styled-components';
// import { theme } from '../../theme';

// export const Wrap = styled.div`
//   display: flex;
//    /* 컨테이너 사이의 여백을 최대로 확보하여 내부 요소를 양쪽으로 분산 배치 */

//   ${theme.media.mobile`
//   position: relative;
//   flex-direction: column;
//   width: 100%;
//   height: 100%;
//   `}

//   ${theme.media.desktop`

//   display: flex;
//   justify-content: flex-end;
//   // margin-top: 15rem;
//   //padding-top: 15rem;
//   position: relative;
//   z-index: 99;


//   //여기 변경
//   flex-direction: row-reverse;
//   justify-content: flex-start;
//   `}

// `;

// export const OutContainer = styled.div`
//   width: 100%;
//   height: 100%;
//   padding-top: 5rem;
//   padding-bottom: 2.5rem; //40px;
//   flex-direction: column;
//   justify-content: flex-start;
//   align-items: center;
//   gap: 1.875rem; // 30px;
//   display: flex;
//   background: #f3f3f6;
//   border-radius: 10px;
//   overflow: hidden;

//   //하 여기부분 ..
//   // position: fixed;
//   left: 0;
//   z-index: 0;


//   position: fixed;


  
//   ${theme.media.mobile`

//   padding-top: 10rem;
//   position: relative;
//   z-index: 0;
//   gap: 0.5rem; // 30px;
//   height: auto; // 모바일에서는 내용에 따라 높이 자동 조정
//   overflow-y: auto; // 내용이 넘칠 경우 세로 스크롤 허용
//   z-index: 0;
//   `}
// `;

// export const Icon = styled.div`
//   left: 13.1875rem; //211px;
//   top: 7.25rem; //116px;
//   display: flex;
//   flex-direction: column;

//   ${theme.media.mobile`
//   flex-direction: row;
//   margin-top: 1.25rem;
// `}

// `;


// export const DrawingArea = styled.div`
//   left: 15.1875rem; //211px;
//   //left: 13.1875rem; //211px;
//   top: 7.25rem; //116px;
//   display: flex;

//   //다시 설정
//   // width: 100%; /* 너비를 부모 요소에 맞게 설정 */
//   // height: 60vh; /* 높이를 화면 높이의 60%로 설정 */

//   // width: ${({ canvasWidth }) => canvasWidth}px;
//   // height: ${({ canvasHeight }) => canvasHeight}px;



//   ${theme.media.mobile`
//   flex-direction: column-reverse;
//   display: fixed;
// `}

// ${theme.media.desktop`
//   margin-right: 3.5rem;

// `}

// `;


// export const CanvasContainer = styled.div`
//   width: ${({ canvasWidth }) => canvasWidth}px;
//   height: ${({ canvasHeight }) => canvasHeight}px;
//   // width: 100%; /* 너비를 부모 요소에 맞게 설정 */
//   // height: 100%; /* 높이를 화면 높이의 60%로 설정 */
//   background: white;
//   box-shadow: 0.3125rem 0.3125rem 0.625rem rgba(0, 0, 0, 0.04);

//   /* DrawingArea 내에서 공간을 균등하게 분배하여 CanvasContainer가 DrawingArea 크기에 따라 변하도록 함 */
//   flex: 1;



//     ${theme.media.mobile`
//   `}

// `;

// export const ButtonContainer = styled.div`
//   width: 10rem; //160px;
//   height: 2.75rem; //44px; 
//   padding-left: 1.25rem; //20px;
//   padding-right: 1.25rem; //20px;
//   background: #6487E2;
//   border-radius: 0.25rem; //4px;
//   justify-content: center;
//   align-items: center;
//   display: inline-flex;
//   cursor: pointer;

//   ${theme.media.mobile`
//   `}
// `;

// export const Button = styled.div`
//   width: 7.5rem; //120px;
//   text-align: center;
//   color: white;
//   font-size: 1rem; //16px;
//   font-family: Pretendard-Regular;
//   font-weight: 700;
//   line-height: 1.5rem; //24px
//   word-wrap: break-word;

//   ${theme.media.mobile`

//   display: flex;
//   justify-content: center; /* 중앙 정렬 */
//   align-items: center; /* 중앙 정렬 */
//   width: 100%; /* 화면 너비에 맞게 설정 */
//   margin-left: 1.625rem;
//   margin-right: 1.625rem;
//   `}
// `;



// // 스타일 컴포넌트 정의
// export const WStyledWrapper = styled.div`
//   width: 1.25rem; //20px;
//   height: 1.25rem; //20px;
//   padding: 0.625rem; //10px;
//   background: white;
//   box-shadow: 0rem 0.25rem 0.25rem rgba(39, 40, 43, 0.10);
//   border-radius:18.75rem; //300px;
//   justify-content: center;
//   align-items: center;
//   gap: 0.625rem; //10px;
//   display: inline-flex;
//   margin-right: 1.25rem; //20px;
//   margin-bottom: 1rem; //16px;
//   cursor: pointer;

//   ${theme.media.mobile`
//   `}
// `;

// export const BStyledWrapper = styled.div`
//   width: 1.25rem; //20px;
//   height: 1.25rem; //20px;
//   padding: 0.625rem; //10px;
//   background: #6487E2;
//   box-shadow: 0rem 0.25rem 0.25rem rgba(39, 40, 43, 0.10);
//   border-radius:18.75rem; //300px;
//   justify-content: center;
//   align-items: center;
//   gap: 0.625rem; //10px;
//   display: inline-flex;
//   margin-right: 1.25rem; //20px;
//   margin-bottom: 1rem; //16px;

//   ${theme.media.mobile`
//   `}
// `;

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
