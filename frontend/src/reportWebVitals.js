// reportWebVitals 함수 정의: 웹 성능 데이터를 수집하는 함수
const reportWebVitals = onPerfEntry => {
  // onPerfEntry가 존재하고, 함수인지 확인
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // 'web-vitals' 모듈을 비동기로 import
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Core Web Vitals 측정 함수들을 호출하고, 결과를 onPerfEntry에 전달
      getCLS(onPerfEntry); // Cumulative Layout Shift (CLS) 측정
      getFID(onPerfEntry); // First Input Delay (FID) 측정
      getFCP(onPerfEntry); // First Contentful Paint (FCP) 측정
      getLCP(onPerfEntry); // Largest Contentful Paint (LCP) 측정
      getTTFB(onPerfEntry); // Time to First Byte (TTFB) 측정
    });
  }
};

// reportWebVitals 함수를 기본으로 내보내기
export default reportWebVitals;

/* 이 코드는 웹 사이트의 성능을 측정하고 이를 보고하기 위한 함수입니다. 
주요 측정 항목은 CLS, FID, FCP, LCP, TTFB이며, 이 데이터는 onPerfEntry라는 콜백 함수로 전달됩니다. 
비동기적으로 import를 사용하여 웹 성능 데이터를 필요할 때만 로드하여 성능 효율성을 높임 */