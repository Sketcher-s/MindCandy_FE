import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import { theme } from '../../theme';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/recoilState';
import { ReactComponent as Loading_people } from '../../assets/Draw/Loading_people.svg';
import { ReactComponent as Magnifier } from '../../assets/Draw/Magnifier.svg';
import { useRecoilValue } from 'recoil';
import { loadingStatusState } from '../../recoil/recoilState';

const LoadingStatus = {
  Loading: "Loading",
  Fail: "Fail"
};  

export default function Loading() {
  const loadingStatus = useRecoilValue(loadingStatusState);
  const [modalOpen, setModalOpen] = useState(false); // 모달의 열림/닫힘 상태를 관리합니다.
  const [backModal, setBackModal] = useState(false); // 뒤로가기 감지에 대한 모달
  const [refreshModal, setRefreshModal] = useState(false); // 새로고침 감지에 대한 모달
  const [photoModal, setPhotoModal] = useState(false); // 사진 모달 상태
  const navigate = useNavigate();

  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  if(!isLoggedIn){
    navigate('/');
  }

  // 모달을 50초 후에 자동으로 열기
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalOpen(true); // 50초 후 모달 열기 16000초
    }, 50000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  // loading 상태 확인
  useEffect(() => {
    console.log("loading 상태: ", loadingStatus);
    if (loadingStatus === LoadingStatus.Fail) {
      //setModalOpen(true);
      setPhotoModal(true);
    }
  }, [loadingStatus]);
  
  const handleModalOpen = () => {
    setModalOpen(true); // 모달을 열기 위해 상태를 변경하는 함수
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
  }

  //사진첨부에서 받아온 이미지 불러오기
  const location = useLocation();
  // const imageData = location?.state?.imageData;
  // const imageWidth = location?.state?.width;
  // const imageHeight = location?.state?.height;
  const { loadingImg } = location.state || {};

  // 초기갑을 세션 스토리지에서 가져오기
  const [image, setImage] = useState(sessionStorage.getItem("loadingImg") || "");
  
  // 뒤로가기 || 새로고침 누르면 이미지 날아감 -> 세션 스토리지에 저장하기
  useEffect(() => {
    if (loadingImg) {
        sessionStorage.setItem("loadingImg", loadingImg); // 새로운 이미지 저장
        setImage(loadingImg); // 상태 업데이트
      } else {
        // 만약 loadingImg가 없으면 세션에 저장된 값을 유지
        const storedImage = sessionStorage.getItem("loadingImg");
        if (storedImage) {
          setImage(storedImage);
        }
      }
  }, [loadingImg]); // loadingImg가 변경될 때 실행

  // useEffect(() => {
  //   console.log('대표 이미지: ', loadingImg);
  //   if (loadingImg) {
  //     sessionStorage.removeItem('loadingImg'); // 기존 이미지 삭제
  //     sessionStorage.setItem('loadingImg', loadingImg); // 새로운 이미지 저장
  //   }
  // }, []);

  // 세션 스토리지에서 이미지를 불러오기
  const storedImage = sessionStorage.getItem('loadingImg');

  // useEffect(() => {
  //   console.log('Received location state:', loadingImg); // state 전체 확인
  //   // if (imageData) {
  //   //   const imgElement = document.getElementById('loadedImage');
  //   //   if (imgElement) {
  //   //     imgElement.src = imageData;
  //   //     console.log('이미지 데이터: ', imageData, imgElement);
  //   //   }
  //   //   //console.log(imageWidth);
  //   //   //console.log(imageHeight);
  //   // }
  // }, [loadingImg]);


  // 뒤로가기로 실제 이동시키는 함수
  const handleGoBack = () => {
    console.log('뒤로가기 클릭');
    console.log('모달 상태: ', backModal);
    setBackModal(false);
    window.history.go(-2); // 이전 페이지로 이동
  };

   // 뒤로가기 모달 닫기
   const handleBackClose = () => {
    setBackModal(false); // 뒤로가기 모달 닫기
    window.history.pushState(null, '', window.location.href);
  }

  // 뒤로가기 감지 및 막기
  const usePreventGoBack = () => {
    const preventGoBack = (e) => {
      e.preventDefault(); // 뒤로가기 자체를 막지는 못 함
      setBackModal(true); // 모달을 띄우기
      // 현재 상태를 히스토리에 추가하여 뒤로가기를 막음
      window.history.pushState(null, '', window.location.href); 
      //e.returnValue = '';
    };

    useEffect(() => {
      // 초기 상태를 히스토리에 추가
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', preventGoBack);

      return () => {
        window.removeEventListener('popstate', preventGoBack);
      };
    }, []);
  };

  // 새로고침 함수
  const handleRefreshConfirm = () => {
    // 새로고침을 허용
    setRefreshModal(false);
    window.location.reload();
  };

  // 새로고침 모달 닫기
  const handleRefreshCancel = () => {
    // 새로고침을 막음
    setRefreshModal(false);
  };

  // 새로고침 감지 및 막기
  const usePreventRefresh = () => {
    const handleBeforeUnload = (e) => {
      // 기본적인 새로고침 막기 설정
      e.preventDefault();
      e.returnValue = ''; // 브라우저에 따라 이 설정이 새로고침 확인을 요청할 수 있음
      //setRefreshModal(true); // 새로고침 모달을 띄움
    };
  
    useEffect(() => {
      // 새로고침 감지 설정
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);
  };  

  usePreventGoBack();
  usePreventRefresh();

  // 검사하기 페이지로 돌아가자
  const moveToPrePare = () => {
    navigate("/preparePage");
  }

  return (
  
        
    <OutContainer>

      <TContainer>
        <TexDiv>
          <Text>검사 결과를 기다리고 있어요!</Text>
        </TexDiv>
        <PictureContainer>
          <StyledLoadingPeople src={storedImage}/>
          <StyledMagnifier />
        </PictureContainer>
      </TContainer>

    

    {/* 모달을 열기 위한 버튼 */}
    {/* {modalOpen && (
        <Modal
          title="타임에러 모달창.."
          message="그림이 제대로 그려졌는지 확인해주세요."
          close={handleModalClose} // 모달을 닫는 핸들러를 전달
        />
      )} */}

    {backModal && (
      <Modal
        title="검사가 진행중입니다."
        message="검사 도중 해당 페이지를 이탈하면, 검사가 원활히 이루어지지 않을 수 있습니다."
        onBack={handleGoBack}
        close={handleBackClose} // 뒤로가기 모달 닫기
        />
    )}

    {refreshModal && (
      <Modal
        title="검사가 진행중입니다."
        message="검사 도중 해당 페이지를 새로고침하면, 검사가 원활히 이루어지지 않을 수 있습니다."
        onRefresh={handleRefreshConfirm}
        close={handleRefreshCancel} // 뒤로가기 모달 닫기
        />
    )}

    {photoModal && (
      <Modal
        title="사진 확인이 필요해요!"
        message="사진이 제대로 그려졌는지 확인해주세요."
        close={moveToPrePare}
      />  
    )}


    </OutContainer>

    

  );
}

Loading.propTypes = {
  imageData: PropTypes.string // imageData의 타입을 문자열로 정의
};

const OutContainer = styled.div`
  width: 100%;
  height: 93vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  background: white;
  position: relative;
  overflow: hidden;
`;

const TContainer = styled.div`
width: 100%;
height: 100%;
padding-top: 5rem; //40px;
flex-direction: column;
justify-content: flex-start;
align-items: center;
gap: 1rem; //14px;
display: flex;

position: relative;
`;

const Text = styled.div`
  width: 21.5rem; //296px;
  height: 2.4375rem; //39px;
  color: #3F4045;
  display: flex;
  justify-content: center;
  font-size: 1.625rem; //26px;
  font-family: Pretendard-Regular;
  font-weight: 700;
  line-height: 2.4375rem; //39px;
  word-wrap: break-word;

  ${theme.media.mobile`
    font-size: 1.125rem;
    align-items: center;
    justify-content: center;
  `}
`;

const TexDiv = styled.div`

  ${theme.media.mobile`
  text-align: center;
`}
`;

const PictureContainer = styled.div`
  display: flex;
  width: 35rem; //560px;
  height: 24.5rem; //392px;
  justify-content: center;
  align-items: center;
  gap: 1.25rem; //20px;
  border-radius: 0.75rem; //12px;
  border: 1px solid #E0E1E9;
  background: #F3F3F6;
  margin-top: 1.875rem;
    position: relative; // 또는 absolute 등, 필요에 따라

  ${theme.media.mobile`

`}
`;

const StyledLoadingPeople = styled.img`
  z-index: 1; // 다른 요소들보다 높은 값
  width: 80%;
  object-fit: cover;
  border-radius: 0.75rem; //12px;
`;

const StyledMagnifier = styled(Magnifier)`
  position: absolute; // 위치 고정 대신 상대적 위치 조정
  z-index: 998; // 다른 요소보다 위에 위치. 모달 떴을 때 보단 작아야 함.
  animation: trianglePath 4s infinite;

  @keyframes trianglePath {
    0% {
      transform: translateY(10); // 시작 지점
    }
    33% {
      transform: translateY(60px); // 위로 100px
    }
    46% {
      transform: translate(-80px, 50px); // 오른쪽으로 100px, 위에서 유지
    }
    86% {
      transform: translate(30, 120px); // 오른쪽으로 100px, 위에서 유지
    }
      66% {
      transform: translateY(-60px); // 위로 100px
    }
    100% {
      transform: translate(80px, 0px); // 원래 높이로 내려오면서 오른쪽에서 시작 위치
    }
    120% {
      transform: translate(10); // 원래 높이로 내려오면서 오른쪽에서 시작 위치
    }
  }
`;