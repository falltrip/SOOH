import React from 'react';
import { useParams } from 'react-router-dom';

const ContentDetailPage: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();

  return (
    <div style={{ padding: '20px', marginTop: '80px' }}> {/* Navbar 높이 고려한 marginTop */}
      <h1>콘텐츠 상세 페이지</h1>
      <p>요청된 카테고리: {category}</p>
      <p>요청된 ID: {id}</p>
      <p><em>이 페이지는 실제 콘텐츠를 표시하도록 추후 개발이 필요합니다.</em></p>
    </div>
  );
};

export default ContentDetailPage;
