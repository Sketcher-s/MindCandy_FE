import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';


export const countState = atom({
  key: 'countState',
  default: 0,
});
 
//그림그리기 페이지 
// export const canvasSizeState = atom({
//     key: 'canvasSizeState',
//     default: { width: '21.125rem', height: '21.125rem' },
//   });

// export const canvasContentState = atom({
//     key: 'canvasContentState',
//     default: null,
//   });

// 로그인 지속
const { persistAtom } = recoilPersist();

// 로그인
export const LoginState = atom({
  key: 'LoginState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

// 사이드바
export const SidebarState = atom({
  key: 'SidebarState',
  default: false,
});

// loading 페이지에서 검사 결과에 대한 성공/실패 여부를 알아야 함
export const loadingStatusState = atom({
  key: 'loadingStatusState', // 고유한 key
  default: null, // 초기값은 null
});