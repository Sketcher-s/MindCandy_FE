import styled from 'styled-components';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReactComponent as User } from '../assets/User/user.svg';
import { theme } from '../theme';
import InquiryMypage from '../components/MyPage/InquiryMypage';
import WithDrawal from '../components/WithDrawal/WithDrawal';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { LoginState } from '../recoil/recoilState';
import noneData from '../assets/mypage/noneData.svg';

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
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

// 프로필 원형
export const ProfileCircle = styled.div`
  
  background: #F3F3F6;
  border-radius: 9999rem;
 
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.media.mobile`
    width: 2rem;
    height: 2rem;
    border: 0.1874rem solid #F3F3F6;
`}

  ${theme.media.desktop`
  width: 3.75rem;
  height: 3.75rem;
  border: 0.1025rem solid #F3F3F6;
`}
`;


// 사용자 정보
export const UserName = styled.div`
  color: #3F4045;
  font-weight: 700;
  line-height: 2.0625rem;
  word-wrap: break-word;
  ${theme.media.mobile`
  font-size: 1rem;
  line-height: 1.5rem;
`}

  ${theme.media.desktop`
  font-size: 1.375rem;
`}
`;

export const UserEmail = styled(UserName)`
 
  ${theme.media.mobile`
  font-size: 0.8rem;
  line-height: 1.5rem;
`}

  ${theme.media.desktop`
  font-size: 1rem;
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
// const SectionTitle = styled.div`
//   color: #6487E2;
//   font-size: 1rem;
//   font-weight: 700;
//   line-height: 1.5rem;
//   word-wrap: break-word;
// `;

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
  align-items: flex-start; // 데이터 있을 때 왼쪽 정렬
  gap: 2rem;
  overflow: auto;
  height: 100%;
  margin-bottom: 2rem;

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
    background-color: #A7A9B0;
  }
`;

// 항목 컨테이너
const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.625rem;
  cursor: pointer;
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
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userInfo,setUserInfo] = useState({ name: '', email: '' });
  const size = 8;
  const [modalStatus, setModalStatus] = useState(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
    
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if(!isLoggedIn){
    navigate('/');
  }

  const loadMoreData = useCallback(async () => {
    if(loading) return;
    setLoading(true);
    try {
      console.log('loading more data');
      const response = await InquiryMypage(page, size);
        
      // 응답 구조를 확인
      console.log('API Response:', response);

      const { simpleMemberDto, simpleResultDtoList } = response;
    
      if(page === 0){
        setUserInfo({
          name: simpleMemberDto.name,
          email: simpleMemberDto.email,
        });
      }

      // simpleResultDtoList 비어있을 때 처리
      if (simpleResultDtoList.length === 0 && page === 0) {
      // 빈 데이터일 때 사용자에게 보여줄 피드백 추가
        console.log('No data available');
        setData([]); // 빈 배열을 설정
      } else {
      // 데이터가 있을 경우 기존 데이터에 추가
        setData(prevData => [...prevData, ...simpleResultDtoList]);
      }
    
      setPage(prevPage => prevPage + 1);
        
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);


  useEffect(() => {
    const handleScroll = () => {
      console.log('scrolling...');
      // listWrapperRef.current를 사용하여 스크롤 위치 접근
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        if (clientHeight + scrollTop + 50 >= scrollHeight && !loading) {
          console.log('Load more data condition met');
          loadMoreData();
        }
      }
    };
  
    const listWrapper = listRef.current;
    if (listWrapper) {
      listWrapper.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (listWrapper) {
        listWrapper.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loadMoreData, loading]); // 의존성 배열 업데이트

  useEffect(() => {
    loadMoreData(); // 초기 데이터 로드     
  }, []); 


  const handleClose = () => {
    setModalStatus(null);
  };

  const handleOpen = () => {
    setModalStatus('doubleCheck'); 
  };

  // 회원탈퇴
  const handleWithDraw = async() => {
    try{
      const response = await WithDrawal();
      console.log('api', response);
      setModalStatus('alert');
      localStorage.removeItem('jwtToken'); // 토큰 삭제
      setIsLoggedIn(false); // 로그아웃
    }catch (error){
      console.error('Error delete:', error);
    }
  };

  // 메인으로 이동
    
  const moveToMain = () => {
    navigate('/');
  };

  // 항목 클릭 시, 해당 항목 결과 페이지로 이동
  const moveToList = (id, title) => {
    navigate('/result', { state: { response: { result: { id: id, title: title } },fromMyPage:true } });
  };
 
  // 시간 띄우기
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear(); // 년도
    const month = date.getMonth() + 1; // 월 (0부터 시작하므로 +1)
    const day = date.getDate(); // 일
    const hour = date.getHours(); // 시
    const minute = date.getMinutes(); // 분

    // 두자리
    const monthFormatted = (`0${month}`).slice(-2);
    const dayFormatted = (`0${day}`).slice(-2);
    const hourFormatted = (`0${hour}`).slice(-2);
    const minuteFormatted = (`0${minute}`).slice(-2);

    return `${year}년 ${monthFormatted}월 ${dayFormatted}일 ${hourFormatted}시 ${minuteFormatted}분`;
  };

  // 최신순으로 정렬
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA; // 내림차순 정렬
  });
  
  return (
    <MyPageContainer>
      <MyPageWrapper>
        <Title>마이페이지</Title>
        <ContentContainer>
          <ProContainer>
            <UserInfoContainer>
              <ProfileContainer>
                <ProfileCircle><User/></ProfileCircle>
              </ProfileContainer>
              <UserInfo>
                <UserName>{userInfo.name}</UserName>
                <UserEmail>{userInfo.email}</UserEmail>
              </UserInfo>
            </UserInfoContainer>
            <WithDrawalButton onClick={handleOpen}>회원탈퇴</WithDrawalButton>
          </ProContainer>
          <Divider />
          <ListContainer>
            <ListWrapper ref={listRef}>
              {sortedData.map((item, index) => (
                <EntryContainer key={index} onClick={() => moveToList(item.id, item.title)}>
                  <EntryText>{item.title || '제목을 입력하세요.'}</EntryText>
                  <EntryDate>{formatDate(item.createdAt)}</EntryDate>
                </EntryContainer>
              ))}
              {sortedData?.length === 0 && <BeforeList src={noneData}/>}
            </ListWrapper>
          </ListContainer>
        </ContentContainer>
        {modalStatus === 'doubleCheck' && <Modal title={`${userInfo.name}님`} message={'회원 탈퇴 시, 모든 검사 기록이 삭제됩니다. 확인 버튼 클릭 시 탈퇴가 완료됩니다.'} withdrawal={handleWithDraw} close={handleClose} />}
        {modalStatus === 'alert' && <Modal title={'그동안 이용해주셔서 감사합니다.'} messgae='' close={moveToMain}></Modal>}
      </MyPageWrapper>
    </MyPageContainer>
  );
};

export default MyPage;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const BeforeList = styled.img`
  display: flex;
  width: 80%;
`;

// 회원탈퇴
const WithDrawalButton = styled.button`
  width: 15%;
  height: 55%;
  font-size: 1rem;
  font-weight: 600;
  line-height: 0.7rem;
  color: #97999F;
  border: none;
  align-self: center;
  text-align: center;
  border-radius: 5px;
  padding-top: 0.15rem;
  cursor: pointer;

  ${theme.media.mobile`
  align-self: center;
  width: 18%;
  height: 35%;
  font-size: 0.5rem;
  font-weight: 600;
  line-height: 0.7rem;
  text-align: center;
  padding-top: 0.11rem;
  `}
`;

// 회원탈퇴 포함한 container
const ProContainer = styled.div`
  display: flex;  
  justify-content: space-between;
  width: 100%;
`;
