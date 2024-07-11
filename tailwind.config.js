/** @type {import('tailwindcss').Config} */

const rem0_10 = { ...Array.from(Array(11)).map((_, i) => `${i / 10}rem`) };
const rem0_100 = { ...Array.from(Array(101)).map((_, i) => `${i / 10}rem`) };
const rem0_800 = { ...Array.from(Array(801)).map((_, i) => `${i / 10}rem`) };

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderWidth: rem0_10,
      borderRadius: rem0_100,
      fontSize: rem0_100,
      lineHeight: rem0_100,
      minWidth: rem0_800,
      minHeight: rem0_800,
      spacing: rem0_800,
      colors: {
        primary: '#112D4E',
        strong: '#421D06',
        blue: '#3366FE',
        gray: {
          bg: '#EFEFEF', // 랜딩페이지 섹션 2 배경
          98: '#989898', // 푸터, input-플레이스 홀더 등 연한 글씨 / 인풋 기본 테두리
          db: '#BDBDBD', // 로그인 회원가입 페이지 버튼 비활성화 시 색상
          dc: '#DCDCDC', // 캘린더 이번 달 아닌 날 흐린 글씨 및 
          fa: '#FAFAFA', // 기술 스택 검색창 배경
          65: '#656565', // 경험치 글씨 색상
        },
        black: {
          DEFAULT: '#000',
          overlay: 'rgba(0, 0, 0, 0.50)', // 모달창 뒷 배경
        },
        red: '#F54025', // 투두 지우기, 계정 지우기
        green: '#1BCC73', // 투두 체크, 경험치 바
      },
      boxShadow: {
        'custom-light': '0px 0px 4px 0px rgba(0, 0, 0, 0.10)',
        'custom-dark': '0px 0px 8px 0px rgba(0, 0, 0, 0.20)',
      },
    },
  },
  plugins: [],
};
