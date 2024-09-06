import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { theme } from '../../theme';
import axios from 'axios';


function ResultTitle() {
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [id,setId]= useState(0);
    const [image, setImage] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
      console.log("location.state:", location.state);
      if (location.state && location.state.response) {
        const { imageUrl } = location.state.response;
        setImage(imageUrl);
      }
    }, [location]);
    
    const jwtToken = localStorage.getItem('jwtToken');  // 로컬 스토리지에서 토큰을 가져옵니다.
    const pictureId = location.state?.response?.pictureDto?.id;
    console.log("픽쳐 아이디" + pictureId);
    useEffect(() => {
      const fetchPictureDetails = async () => {
        if (!jwtToken) {
          console.error('Authentication token is not available');
          return;  // 토큰이 없으면 함수를 더 이상 진행하지 않습니다.
        }
    
        try {
          const response = await fetch(`https://dev.catchmind.shop/api/picture/${pictureId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`  // 헤더에 토큰을 포함시킵니다.
            }
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const responseData = await response.json();
          if (responseData && responseData.pictureDto) {
            setImage(responseData.pictureDto.imageUrl);
            console.log('Get response:', responseData);  // 성공 응답 로깅
          } else {
            throw new Error('No valid response data');
          }
        } catch (error) {
          console.error('데이터받아오는거 결과값', error);  // 오류 로깅
        }
      };
    
      fetchPictureDetails();
    }, [jwtToken, pictureId]);  // 의존성 배열에 jwtToken과 pictureId 추가
    
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        validateTitle(event.target.value);
    };

    const validateTitle = (inputTitle) => {
        if (inputTitle.length > 15) {
            setError('제목은 15자를 넘지 말아주세요.');
        } else if (!inputTitle) {
            setError('제목을 입력해주세요.');
        } else {
            setError('');
        }
    };

    const handleSave = async () => {
      const jwtToken = localStorage.getItem('jwtToken');  // 로컬 스토리지에서 토큰을 가져옵니다.
    
      if (!jwtToken) {
        console.error('Authentication token is not available');
        alert('로그인이 필요합니다.');
        return;  // 토큰이 없으면 함수를 더 이상 진행하지 않습니다.
      }
    
      try {
        const response = await fetch(`https://dev.catchmind.shop/api/picture/title`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${jwtToken}`  // 헤더에 토큰을 포함시킵니다.
          },
          body: JSON.stringify({
            id: id,   // 수정할 그림의 ID
            title: title // 새로운 제목
          })
        });

        const responseData = await response.json();
        console.log('PATCH response:', responseData);  // 성공 응답 로깅
      } catch (error) {
        console.error('Error updating title:', error);  // 오류 로깅
      }

        setIsEditing(false);
    };

    const handleEdit = async () => {

      setIsEditing(false);  // 편집 모드 종료
    };
  
    return (
        <div>
            <TitleInput
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="그림의 제목을 입력하세요"
                    readOnly={!isEditing}
                    isError={error.length > 0}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {!isEditing ? (
                    <Button onClick={handleEdit}>수정</Button>
                ) : (
                    <Button onClick={handleSave}>저장</Button>
                )}
                <DrawResult>
                    {image && (
                        <img src={image} alt="Drawing for Analysis" style={{ width: '40%', height: '40%' }} />
                    )}
                </DrawResult>
                <AnalysisResult>{analysisResult}</AnalysisResult>
        </div>
    );
}

export default ResultTitle;

// const ResultSection = styled.div`
//   width: 100%;
// `;

const TitleInput = styled.input`
  width: 100%;
  height: 1.875rem;
  font-size: 1.625rem;
  font-weight: bold;
  border: none;
  border-bottom: 0.125rem solid transparent;

  &:focus {
    outline: none;
    border-bottom: 0.125rem solid #6487e2;
  }
  border-bottom-color: ${props => props.isError ? 'red' : 'transparent'};
  &::placeholder {
    color: rgb(177, 178, 184);
    ${theme.media.mobile`
      font-size: 1rem;
    `}
  }
  ${theme.media.mobile`
    width:90%;
  `}
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  font-weight: 200;
`;

const DrawResult = styled.div`
  margin: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.media.mobile`
    width:90%;
  `}
`;

const AnalysisResult = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #3F4045;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #6487e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5371c9;
  }
`;
