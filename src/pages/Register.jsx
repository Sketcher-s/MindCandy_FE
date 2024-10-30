import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal.jsx';
import { JoinWrapper, LoginContainer, LoginTitle, InputWrapper,
  InputField, InputValue, PasswordIcon, Divider, ButtonWrapper,
  Button, CheckButton, Text, InputContainer, ErrorText } from '../components/Login/LoginStyle.jsx';
import { ReactComponent as PwdIcon } from '../assets/Login/pwdIcon.svg';
import { ReactComponent as NonPwdIcon } from '../assets/Login/nonpwdIcon.svg';
import { useNavigate } from 'react-router-dom';
import CheckEmail from '../components/Register/CheckEmail.jsx';
import CheckRegister from '../components/Register/CheckRegister.jsx';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: 'onChange',
  });

  // 입력 필드 클릭 안 했을 때, 클릭 시, 오류 시 border 색상 다르게 함
  const [focus, setFocus] = useState({
    name: false,
    email: false,
    password: false,
    matchPassword: false,
  });

  const handleFocus = (field) => {
    setFocus({ ...focus, [field]: true });
  };

  const handleBlur = (field) => {
    setFocus({ ...focus, [field]: false });
  };

  const navigate = useNavigate();
  // Login으로 이동
  const moveToLogin = () => {
    setOpen(false); // 모달 닫기
    navigate('/login');

  }

  // 이메일 중복 체크를 해야 회원가입 완료할 수 있음
  const [isEmailCheck, setIsEmailCheck] = useState(false);
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [emailCheckColor, setEmailCheckColor] = useState(''); // 메시지 색상 관리

  // 이메일 중복 체크 버튼 클릭 이벤트 핸들러
  const handleCheckEmail = async () => {
    const email = getValues('email');
    console.log(email);
    try {
      const result = await CheckEmail(email);
      if(!result.isExisted){
        //setModalStatus('check'); // 사용 가능 모달
        setEmailCheckMsg('사용 가능한 이메일입니다.');
        setEmailCheckColor('#A49EE7');
        setIsEmailCheck(true);
      } else {
        //setModalStatus('dupli'); // 중복 모달
        setEmailCheckMsg('이미 가입된 이메일입니다.');
        setEmailCheckColor('red'); // 중복 시 빨간색
        setIsEmailCheck(false);
      }
    } catch (error) {
      console.error('이메일 중복 검사 중 오류 발생', error);
    }
  }


  // 비밀번호 숨기기/보이기
  const [hidePwd, setHidePwd] = useState(true);
  const [hideMatch, setHideMatch] = useState(true);

  // 비밀번호 보기/숨기기 핸들러
  const togglePasswordVisibility = () => {
    setHidePwd(!hidePwd);
  };

  const toggleMatchVisibility = () => {
    setHideMatch(!hideMatch);
  }

  // 중복 체크 모달 상태
  const [modalStatus, setModalStatus] = useState(null);

  const handleClose = () => {
    setModalStatus(null);
  }

  // 회원가입 완료 모달 상태
  const [open, setOpen] = useState(false);


  // 모달 닫기
  const handleModalClose = () => {
    setOpen(false);
  }

  // 폼 제출
  const onSubmit = async (data) => {
    //console.log(data);
    if (isValid & isEmailCheck) {
      // 유효한 경우 회원가입 요청 보내기
      try {
        const result = await CheckRegister(data.name, data.email, data.password);
        console.log('제출 성공', result);
        setOpen(true);
      } catch (error) {
        console.error('회원가입 실패', error);
      }
    } else if(isValid){ // 중복 체크 확인 안 한 경우
      // 중복체크하라는 모달 띄우기
      setModalStatus('checkPlease');
    }else{
      console.log('제출 실패');
    }
  };

  const nameRegister = register('name', {
    required: { value: true , message: '이름을 입력해주세요.'},
    minLength: {
      value: 2,
      message: '이름은 2글자 이상 6글자 이하여야 합니다.',
    },
    maxLength: {
      value: 6,
      message: '이름은 2글자 이상 6글자 이하여야 합니다.',
    },
  });

  const emailRegister = register('email', {
    required: { value: true, message: '이메일을 입력해주세요.'},
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '이메일 형식이 올바르지 않습니다.',
    },
  });

  const pwdRegister = register('password', {
    required: { value: true, message: '비밀번호를 입력해주세요.'},
    pattern: {
      value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@])[a-zA-Z\d!@]{8,12}$/,
      message: '비밀번호는 영문, 숫자, 특수문자(!,@)를 모두 포함하여 8~12글자이어야 합니다.',
    },
  });
  const matchRegister = register('matchPassword', {
    required: { value: true, message: '비밀번호를 다시 입력해주세요.'},
    validate: (value) => value === getValues('password') || '비밀번호가 일치하지 않습니다.', 
  });

  const userName = getValues('name'); // name 필드 값
  const emailWatch = watch('email');

  useEffect(() => {
    if (emailWatch) {
      // 이메일 값이 변경되면 중복 체크 메시지 초기화
      setEmailCheckMsg('');
      //setEmailCheckColor('');
      setIsEmailCheck(false);
    }
  }, [emailWatch]);

  return (
    <LoginContainer>
      <JoinWrapper onSubmit={handleSubmit(onSubmit)}>
        <LoginTitle>회원가입</LoginTitle>
        <InputWrapper>
          <InputContainer>
            <InputField isError={!!errors.name} isFocused={focus.name}>
              <InputValue {...nameRegister} type="text" id="name" placeholder="이름을 입력해 주세요" onFocus={() => handleFocus('name')} 
                            onBlur={() => handleBlur('name')}
                            />
            </InputField>
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
            {/* id가 "name"인 곳에서 발생하는 에러 메시지들을 출력함 */}
          </InputContainer>
          <InputContainer>
            <InputField isError={!!errors.email} isFocused={focus.email}>
              <InputValue type="email" id="email" placeholder="이메일을 입력해 주세요" {...emailRegister} onFocus={() => handleFocus('email')} 
                            onBlur={() => handleBlur('email')} /> 
              <CheckButton type="button" isError={!!errors.email} disabled={!!errors.email || !emailWatch} width={62} background="white" border='1px #6487E2 solid' onClick = {handleCheckEmail}><Text>중복체크</Text></CheckButton>
            </InputField>
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            {emailCheckMsg && (
              <ErrorText style={{ color: emailCheckColor }}>{emailCheckMsg}</ErrorText>
            )}
          </InputContainer>
          <InputContainer>
            <InputField isError={!!errors.password} isFocused={focus.password}>
              <InputValue type={hidePwd ? 'password' : 'text'} id="password" placeholder="비밀번호를 입력해 주세요" {...pwdRegister} onFocus={() => handleFocus('password')} 
                            onBlur={() => handleBlur('password')}/>
              <PasswordIcon onClick={togglePasswordVisibility}>{hidePwd ? <NonPwdIcon /> : < PwdIcon/>}</PasswordIcon>
            </InputField>
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </InputContainer>
          <InputContainer>
            <InputField isError={!!errors.matchPassword} isFocused={focus.matchPassword}>
              <InputValue
                type={hideMatch ? 'password' : 'text'} // 비밀번호 숨김/보임에 따라 타입을 바꿈
                id="matchPassword"
                placeholder="비밀번호를 다시 입력해 주세요"
                {...matchRegister}
                onFocus={() => handleFocus('matchPassword')} 
                            onBlur={() => handleBlur('matchPassword')}
              />
              <PasswordIcon onClick={toggleMatchVisibility}>{hideMatch ? <NonPwdIcon /> : < PwdIcon/>}</PasswordIcon>
            </InputField>
            {errors.matchPassword && <ErrorText>{errors.matchPassword.message}</ErrorText>}
          </InputContainer>
        </InputWrapper>
        <Divider />
        <ButtonWrapper>
          <Button
            width="100%"
            back={isValid}
            color={'white'}
            type="submit"
            //onClick={() => {isValid && setOpen(true)}}
          >
            <div>회원가입 완료</div>
          </Button>
        </ButtonWrapper>
        {modalStatus === 'checkPlease' && <Modal title='이메일 중복 체크를 진행해주세요.' message='' close={handleClose}></Modal>}
        {open && <Modal title="환영합니다!" message={<>{`${userName}님, 회원가입이 완료되었습니다.`}<br/>{`Catch Mind에서 그림 심리 검사를 진행해보세요!`}</>} close={moveToLogin} />}
      </JoinWrapper>
    </LoginContainer>
  );
};

export default Register;

