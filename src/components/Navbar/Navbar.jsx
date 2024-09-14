import { useRecoilState } from 'recoil';
import React from 'react';
import { LoginState, SidebarState } from '../../recoil/recoilState';
import NavbarMember from './NavbarMember';
import NavbarNoMember from './NavbarNoMember';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  // sidebar 상태
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(SidebarState);

  // 사이드 바 이벤트
  const toggleSidebar= () =>{
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // 토큰을 저장하는 방식에 따라 변경
    if (!token || isTokenExpired(token)) { 
      setIsLoggedIn(false);
    }
  }, []);

  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const tokenExpiration = decodedToken.exp; // 만료 시간은 보통 'exp'라는 필드에 저장됩니다.
    return tokenExpiration < Date.now() / 1000;
  };

  return(
    <>
      {isLoggedIn ? 
        <NavbarMember toggleSidebar={toggleSidebar}/> : <NavbarNoMember/>
      }
    </>
        
  );
};

export default Navbar;
