/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // HTML 파일 (메인 엔트리)
    "./src/**/*.{js,ts,jsx,tsx}", // src 폴더 내의 모든 .js, .ts, .jsx, .tsx 파일
    // 필요하다면 다른 경로도 추가 (예: "./public/**/*.html")
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}