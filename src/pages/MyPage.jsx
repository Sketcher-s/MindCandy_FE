import styled from 'styled-components';
import React, {useState, useEffect} from 'react';
import { ReactComponent as User } from '../assets/User/user.svg';
import { theme } from '../theme';

// 주요 컨테이너
const MyPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  widht: 100%;
  height: 93vh;
`;

const MyPageWrapper = styled.div`
  height: 80%;
  background: white;
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;

  ${theme.media.mobile`
  width: 75%;
  gap: 1rem;
  padding: 1.5rem;
`}

  ${theme.media.desktop`
  width: 60%;
  gap: 2.5rem;
  padding: 2.5rem 3.125rem;
`}
`;

// 타이틀
const Title = styled.div`
  color: #27282B;
  font-weight: 700;
  line-height: 2.4375rem;
  word-wrap: break-word;

  ${theme.media.mobile`
  font-size: 1.1rem;
`}

  ${theme.media.desktop`
  font-size: 2rem;
`}
`;

// 사용자 및 내용 컨테이너
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 90%;
  ${theme.media.mobile`
  gap: 0.25rem;
  width: 100%;
  
`}

  ${theme.media.desktop`
  width: 80%;
  gap: 1.875rem;
`}
`;

// 사용자 정보 컨테이너
export const UserInfoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  
  ${theme.media.mobile`
  gap: 0.8rem;
`}

  ${theme.media.desktop`
  gap: 1.875rem;
`}
`;

// 프로필 및 이메일 컨테이너
export const ProfileContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

// 프로필 원형
export const ProfileCircle = styled.div`
  
  background: #F3F3F6;
  border-radius: 9999rem;
 
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.media.mobile`
  width: 1.3rem;
    height: 1.3rem;
    border: 0.1874rem solid #F3F3F6;
`}

  ${theme.media.desktop`
  width: 3.75rem;
  height: 3.75rem;
  border: 0.1025rem solid #F3F3F6;
`}
`;

// 사용자 이메일
export const UserEmail = styled.div`
  text-align: right;
  color: #3F4045;
  
  font-weight: 700;
  line-height: 2.0625rem;
  word-wrap: break-word;
  ${theme.media.mobile`
  font-size: 1rem;
`}

  ${theme.media.desktop`
  font-size: 1.375rem;
`}
`;

// 구분선
export const Divider = styled.div`
  width: 100%;
  height: 0.0625rem;
  border: 1px solid #E0E1E9;
  margin: auto;
  ${theme.media.mobile`
    margin: 1rem 0;
  `}
`;

// 섹션 타이틀
const SectionTitle = styled.div`
  color: #6487E2;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  word-wrap: break-word;
`;

// 목록 컨테이너 -> 검사 일기 포함
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  height: 80%;
`;

// 목록 wrapper
const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2rem;
  overflow: auto;
  height: 100%;

  &::-webkit-scrollbar-track {
    border-radius: 0.125rem;
    background-color: lightgray;
  }
  &::-webkit-scrollbar {
    width: 0.25rem;
    border-radius: 0.125rem;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0.125rem;
    background-color: #A7A9B0;};
  }
`;

// 항목 컨테이너
const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.625rem;
`;

// 항목 텍스트
const EntryText = styled.div`
  width: 100%;
  color: #3F4045;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  word-wrap: break-word;
`;

// 날짜 텍스트
const EntryDate = styled.div`
  color: #97999F;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.125rem;
  word-wrap: break-word;
`;

// MyPage 함수형 컴포넌트
const MyPage = () => {
  // 로그인한 사용자의 이메일 가져오기

  // 목록 조회 api 연동
    
  return (
    <MyPageContainer>
        <MyPageWrapper>
          <Title>마이페이지</Title>
          <ContentContainer>
            <UserInfoContainer>
              <ProfileContainer>
                <ProfileCircle><User/></ProfileCircle>
              </ProfileContainer>
              <UserEmail>qwe@naver.com</UserEmail>
            </UserInfoContainer>
            <Divider />
            <ListContainer>
              <SectionTitle>검사 일기</SectionTitle>
              <ListWrapper>
                <EntryContainer>
                  <EntryText>가나다라마바사</EntryText>
                  <EntryDate>2024년 5월 1일</EntryDate>
                </EntryContainer>
                <EntryContainer>
                  <EntryText>가나다라마바사</EntryText>
                  <EntryDate>2024년 5월 1일</EntryDate>
                </EntryContainer>
                <EntryContainer>
                  <EntryText>가나다라마바사</EntryText>
                  <EntryDate>2024년 5월 1일</EntryDate>
                </EntryContainer>
                <EntryContainer>
                  <EntryText>가나다라마바사</EntryText>
                  <EntryDate>2024년 5월 1일</EntryDate>
                </EntryContainer>
                <EntryContainer>
                  <EntryText>가나다라마바사</EntryText>
                  <EntryDate>2024년 5월 1일</EntryDate>
                </EntryContainer>
                <EntryContainer>
                  <EntryText>가나다라마바사</EntryText>
                  <EntryDate>2024년 5월 1일</EntryDate>
                </EntryContainer>
                <EntryContainer>
                  <EntryText>가나다라마바사</EntryText>
                  <EntryDate>2024년 5월 1일</EntryDate>
                </EntryContainer>
              </ListWrapper>
            </ListContainer>
          </ContentContainer>
        </MyPageWrapper>
    </MyPageContainer>
  );
}

export default MyPage;

 {/* 임의로 text와 data라고 해 둔 것임 !!! */}
//  {entries.map((entry) => ( // entries를 순회하며 각 항목 렌더링
//                 <EntryContainer key={entry.id}>
//                 <EntryText>{entry.text}</EntryText>
//                 <EntryDate>{entry.data}</EntryDate>
               
//               </EntryContainer>
//               ))} 
