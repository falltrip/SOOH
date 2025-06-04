import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>관리자 페이지</h1>
      <p>이곳에서 콘텐츠를 관리할 수 있습니다.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        {/* 콘텐츠 관리 버튼 UI 골격 */}
        <button style={{ marginRight: '10px', padding: '8px 12px' }}>콘텐츠 추가</button>
        <button style={{ marginRight: '10px', padding: '8px 12px' }}>콘텐츠 수정</button>
        <button style={{ padding: '8px 12px' }}>콘텐츠 삭제</button>
      </div>

      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>등록된 콘텐츠 리스트 (예시)</h2>
        {/* 실제 콘텐츠 리스트는 추후 구현 */}
        <p>콘텐츠 목록이 여기에 표시됩니다.</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Iframe으로 외부 페이지 연결 (예시)</h2>
        <iframe
          title="Admin Content Iframe"
          style={{ width: '100%', height: 'calc(100vh - 400px)', border: '1px solid #ddd' }}
          src="#" // 초기 src, 필요에 따라 변경
        ></iframe>
      </div>
    </div>
  );
};

export default AdminPage;
