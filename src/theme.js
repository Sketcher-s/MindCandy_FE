export const theme = {
    media: {
      mobile: (styles) => `
          @media (max-width: 767px) {
            ${styles}
          }
        `,
        //모바일 세로
        mobilePortrait: (styles) => `
        @media (max-width: 767px) and (orientation: portrait) {
          ${styles}
        }
      `,
      //모바일 가로
        mobileLandscape: (styles) => `
        @media (max-width: 767px) and (orientation: landscape) {
          ${styles}
        }
      `,

      //테블릿 가로
      tablet: (styles) => `
          @media (min-width: 768px) and (max-width: 1023px) {
            ${styles}
          }
        `,

      desktop: (styles) => `
          @media (min-width: 768px) {
            ${styles}
          }
        `,
      //데스크탑 세로
      desktopPortrait: (styles) => `
          @media (min-width: 768px) and (orientation: portrait) {
          ${styles}
        }
      `,
      //데스크탑 가로
      desktopLandscape: (styles) => `
          @media (min-width: 768px) and (orientation: landscape) {
          ${styles}
        }
      `,
    },
  };
