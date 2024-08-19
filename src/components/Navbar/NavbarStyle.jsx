import styled from 'styled-components';
import { theme } from '../../theme';


export const Container = styled.div`

`;

export const HeaderWrapper = styled.div`
height: 100%
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  margin: 0;
  overflow: hidden;
`;

export const Header = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 1rem 1.25rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: 7vh;

  ${theme.media.mobile`
  
`}
${theme.media.desktop`
 

`}
`;

export const LogoContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
`;

export const HeaderButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;

export const Button = styled.button`
  width: ${(props) => props.width};
  padding: 0.4rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;

border: ${(props) => props.border || 'none'};
background: ${(props) => props.background || 'transparent'}; // 배경색을 투명하게
outline: none; // 클릭 시 나타나는 윤곽선 제거
cursor: pointer;
  
  // 비회원-모바일, 메인페이지 버튼 숨기기
  ${(props) =>
    props.noMember &&
    theme.media.mobile`
    display: none;
`}

  ${(props) =>
    props.issignup &&
    theme.media.mobile`
      display: none;
`}
`;

export const Text = styled.div`
  text-align: center;
  color: ${(props) => props.color || '#A49EE7'};
  font-size: 12px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  line-height: 1.12rem;
  word-wrap: break-word;
`;

export const Divider = styled.div`
  width: 100%;
  height: 0;
  border: 1px #e0e1e9 solid;
`;
