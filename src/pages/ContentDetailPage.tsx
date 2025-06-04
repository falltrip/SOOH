import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseClient';

interface ContentData {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  fileUrl?: string;
  filePath?: string;
  projectUrl?: string; // <<< 이 줄 추가
  thumbnailUrl?: string;
  createdAt?: Timestamp | Date;
}

const ContentDetailPage: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) {
        setError('콘텐츠 ID가 제공되지 않았습니다.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'contents', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContentData({ id: docSnap.id, ...docSnap.data() } as ContentData);
        } else {
          setError('해당 ID의 콘텐츠를 찾을 수 없습니다.');
          setContentData(null);
        }
      } catch (err) {
        console.error("Error fetching content: ", err);
        setError('콘텐츠를 불러오는 중 오류가 발생했습니다.');
        setContentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '20px', marginTop: '80px', textAlign: 'center' }}>
        <p>콘텐츠를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', marginTop: '80px', textAlign: 'center', color: 'red' }}>
        <h1>오류</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div style={{ padding: '20px', marginTop: '80px', textAlign: 'center' }}>
        <p>콘텐츠 데이터가 없습니다.</p>
      </div>
    );
  }

  // 콘텐츠 렌더링 로직 함수
  const renderContent = () => {
    // projectUrl이 있으면 최우선으로 iframe 렌더링
    if (contentData.projectUrl && typeof contentData.projectUrl === 'string' && contentData.projectUrl.trim() !== '') {
      return (
        <iframe
          src={contentData.projectUrl}
          title={contentData.title || '프로젝트 콘텐츠'}
          style={{ display: 'block', width: '100%', height: '700px', margin: '20px auto 0', border: '1px solid #ddd', borderRadius: '8px' }}
          // sandbox="allow-scripts allow-same-origin" // 외부 사이트이므로 sandbox를 더 엄격하게 하거나, 사용자와 협의 필요
        ></iframe>
      );
    }

    // projectUrl이 없으면 기존 fileUrl/filePath 로직 수행
    if (!contentData.filePath || !contentData.fileUrl) {
      return <p style={{ marginTop: '20px', color: '#888' }}>표시할 콘텐츠 파일 정보가 없습니다.</p>;
    }

    const filePath = contentData.filePath.toLowerCase();
    const fileUrl = contentData.fileUrl;

    // 이미지 파일 확장자 목록
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    // HTML 파일 확장자 목록
    const htmlExtensions = ['.html', '.htm'];

    if (imageExtensions.some(ext => filePath.endsWith(ext))) {
      return (
        <img
          src={fileUrl}
          alt={contentData.title || '콘텐츠 이미지'}
          style={{ display: 'block', maxWidth: '100%', height: 'auto', margin: '20px auto 0', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        />
      );
    } else if (htmlExtensions.some(ext => filePath.endsWith(ext))) {
      return (
        <iframe
          src={fileUrl}
          title={contentData.title || 'HTML 콘텐츠'}
          style={{ display: 'block', width: '100%', height: '700px', margin: '20px auto 0', border: '1px solid #ddd', borderRadius: '8px' }}
          // sandbox="allow-scripts allow-same-origin" // 필요에 따라 sandbox 옵션 조정. 외부 스크립트 실행을 막으려면 빼거나 더 제한적으로 설정.
        ></iframe>
      );
    } else {
      return (
        <div style={{ marginTop: '20px' }}>
            <p>지원하지 않는 파일 형식입니다: {contentData.filePath}</p>
            <p>파일 URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a> (직접 열어보세요)</p>
        </div>
      );
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '80px', maxWidth: '1200px', margin: '80px auto 0' }}> {/* Navbar 높이 고려 및 중앙 정렬 */}
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#333' }}>{contentData.title || '제목 없음'}</h1>
        {contentData.description && <p style={{ fontSize: '1.1em', color: '#555', marginTop: '10px' }}>{contentData.description}</p>}
      </header>

      {/* 콘텐츠 렌더링 영역 */}
      {renderContent()}

      {/* 추가 정보 (디버깅 또는 참고용) - 필요시 주석 해제
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '0.9em', color: '#777' }}>
        <p><strong>카테고리 (URL):</strong> {category}</p>
        <p><strong>ID (URL):</strong> {id}</p>
        <p><strong>Firestore File URL:</strong> <a href={contentData.fileUrl} target="_blank" rel="noopener noreferrer">{contentData.fileUrl}</a></p>
        <p><strong>Firestore File Path:</strong> {contentData.filePath}</p>
      </div>
      */}
    </div>
  );
};

export default ContentDetailPage;
