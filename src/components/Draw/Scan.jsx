import styled, {keyframes} from "styled-components";
import { ReactComponent as SpinnerImg } from "../../assets/Scan/line_shadow.svg";
import { ReactComponent as SpinnerBar } from "../../assets/Scan/bar.svg";
import React from "react";
import { theme } from "../../theme";

const Scan = () => {

  return (
    <SpinnerWrapper>
        <SpinnerBarStyled/>
        <StyledSpinnerImg/>
    </SpinnerWrapper>
  );  
};

export default Scan;



// const SlideM = keyframes`
//   0% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(200px);
//   }
//   100% {
//     transform: translateY(0);
//   }
// `;

// const SlideD = keyframes`
// 0% {
//   transform: translateY(0);
// }
// 50% {
//   transform: translateY(450px);
// }
// 100% {
//   transform: translateY(0);
// }
// `;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: absolute;
  //left: 50;
  z-index: 1;
  //margin-top: 4rem;
  width: 100%;
  align-items: center;

  ${theme.media.mobile`
    top: 28%;
    animation: SlideM 2.7s linear infinite both;
`}

  ${theme.media.desktop`
    //width: 40rem;
    top: 40%;
    animation: SlideD 2.7s linear infinite both;
`}
`;

const StyledSpinnerImg = styled(SpinnerImg)`
  //width: 100%;
  //height: 100%;

  ${theme.media.desktop`
    //width: 35rem;
    width: 40%;
`}

${theme.media.mobile`
    //width: 20rem;
    width: 70%;
`}
`;

const SpinnerBarStyled = styled(SpinnerBar)`
//height: 100%;

${theme.media.desktop`
    //width: 35rem;
    width: 40%;
`}

${theme.media.mobile`
    //width: 20rem;
    width: 70%;
`}
`;
