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
    
    useEffect(() => {
      const fetchPictureDetails = async () => {
        try {
          const pictureId = location.state?.id; // pictureId를 location.state에서 받아오거나 다른 방식으로 설정
          if (!pictureId) {
            console.error("id값 없음");
            return;
          }
          const response = await axios.get(`https://dev.catchmind.shop/api/picture/${pictureId}`);
          if (response.data) {
            setImage(response.data.pictureDto.imageUrl);

          }
        } catch (error) {
          console.error("오류다 임마", error);
        }
      };
    
      fetchPictureDetails();
    }, []);
    
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
        setIsEditing(false);
    };

    const handleEdit = async () => {

      setIsEditing(false);  // 편집 모드 종료
    };
  
    return (
        <div>
            <ResultSection>
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
            </ResultSection>
        </div>
    );
}

export default ResultTitle;

const ResultSection = styled.div`
  width: 100%;
`;

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
