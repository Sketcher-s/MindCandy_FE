import React from 'react';
import { BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import './index.css';
import PrepareDraw from './components/Draw/PrepareDraw';
import Draw from './components/Draw/Draw';
import Loading from './components/Draw/Loading';
import './assets/font/font.css';
import PreparePicture from './components/Draw/PreparePic';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import Result from './pages/Result';
import Main from './pages/Main';
import Camera from './components/Draw/Camera';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { RecoilRoot } from 'recoil';
import styled from 'styled-components';

// 스크롤 생기는 여부
const PageLayout = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/';
  const isPicPage = location.pathname === '/preparepicture';
  const isResultPage = location.pathname === '/result';
  const isDraw = location.pathname === '/draw';

  return (
    <Container isMainPage={isMainPage} isPicPage={isPicPage} isResultPage={isResultPage} isDraw={isDraw}>
      <RecoilRoot>
        <Navbar/>
            <Sidebar/>
            <Routes>
        
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/mypage" element={<MyPage/>} />
              <Route path="/preparedraw" element={<PrepareDraw/>} />
              <Route path="/draw" element={<Draw/>} />
              <Route path="/preparepicture" element={<PreparePicture/>} />
              <Route path="/loading" element={<Loading/>} />
              <Route path="/" element={<Main/>} />
              <Route path="/result" element={<Result/>} />
              <Route path="/camera" element={<Camera/>} />
            </Routes>
      </RecoilRoot>
    </Container>
  );
}

function App() {
  return(
    <BrowserRouter forceScrollRestoration={false}>
      <PageLayout/>
    </BrowserRouter>
  )

    

}

export default App;

const Container = styled.div`
  height: ${(props) => (props.isMainPage || props.isPicPage || props.isResultPage ? 'auto' : '100vh')};
  overflow-y: ${(props) => (props.isMainPage  || props.isPicPage || props.isResultPage ? 'auto' : 'hidden')};
  overflow-x: hidden;
`;