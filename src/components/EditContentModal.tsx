// src/components/EditContentModal.tsx
import React, { useState, useEffect } from 'react'; // Removed useCallback
import { X, Loader2, Image as ImageIcon, FileText } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: {
    title: string;
    description: string;
    category: string;
    newThumbnailFile: File | null;
    newContentFile: File | null;
    projectUrl: string; // 추가
  }) => Promise<void>;
  categories: Category[];
  isSaving: boolean;
  contentToEdit: {
    id: string;
    title: string;
    description?: string;
    category: string;
    thumbnailUrl?: string;
    fileUrl?: string;
    projectUrl?: string; // 선택적 필드로 존재 확인
  } | null;
}

const EditContentModal: React.FC<EditContentModalProps> = ({ isOpen, onClose, onSave, categories, isSaving, contentToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [projectUrl, setProjectUrl] = useState('');
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [newContentFile, setNewContentFile] = useState<File | null>(null);
  const [newThumbnailPreview, setNewThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && contentToEdit) {
      setTitle(contentToEdit.title || '');
      setDescription(contentToEdit.description || '');
      setSelectedCat(contentToEdit.category || '');
      setProjectUrl(contentToEdit.projectUrl || ''); // 추가
      // 파일 관련 상태 초기화
      setNewThumbnailFile(null);
      setNewContentFile(null);
      if (newThumbnailPreview) { // 기존 미리보기 URL 해제
        URL.revokeObjectURL(newThumbnailPreview);
      }
      setNewThumbnailPreview(null);
    } else if (isOpen) {
      setTitle('');
      setDescription('');
      setProjectUrl(''); // 추가
      if (categories.length > 0) {
        const firstValidCategory = categories.find(c => c.id !== 'all');
        setSelectedCat(firstValidCategory?.id || categories[0]?.id || '');
      } else {
        setSelectedCat('');
      }
      // 파일 관련 상태 초기화 (contentToEdit가 null일 때)
      setNewThumbnailFile(null);
      setNewContentFile(null);
      if (newThumbnailPreview) {
        URL.revokeObjectURL(newThumbnailPreview);
      }
      setNewThumbnailPreview(null);
    }
    // 모달이 닫힐 때도 파일 상태 초기화
    if (!isOpen) {
        setNewThumbnailFile(null);
        setNewContentFile(null);
        setProjectUrl(''); // 추가
        if (newThumbnailPreview) {
          URL.revokeObjectURL(newThumbnailPreview);
        }
        setNewThumbnailPreview(null);
    }
  }, [isOpen, contentToEdit, categories]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 또는 newThumbnailPreview가 바뀌기 전에 이전 URL 해제
    return () => {
      if (newThumbnailPreview) {
        URL.revokeObjectURL(newThumbnailPreview);
      }
    };
  }, [newThumbnailPreview]);

  if (!isOpen) return null;

  const handleNewThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newThumbnailPreview) {
      URL.revokeObjectURL(newThumbnailPreview);
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewThumbnailFile(file);
      setNewThumbnailPreview(URL.createObjectURL(file));
    } else {
      setNewThumbnailFile(null);
      setNewThumbnailPreview(null);
    }
  };

  const handleNewContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewContentFile(e.target.files[0]);
    } else {
      setNewContentFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedCat) {
      alert('제목과 카테고리는 필수입니다.');
      return;
    }
    await onSave({
      title,
      description,
      category: selectedCat,
      newThumbnailFile,
      newContentFile,
      projectUrl // 추가
    });
  };

  const commonInputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150 ease-in-out placeholder-slate-400 text-slate-700 bg-slate-50";

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" onClick={isSaving ? undefined : onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalEnter"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">콘텐츠 수정</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close modal" disabled={isSaving}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label htmlFor="title_modal" className="block text-sm font-medium text-slate-700 mb-1.5">제목 <span className="text-red-500">*</span></label>
            <input type="text" id="title_modal" value={title} onChange={(e) => setTitle(e.target.value)} className={commonInputClass} required placeholder="콘텐츠 제목 입력" disabled={isSaving}/>
          </div>

          <div>
            <label htmlFor="description_modal" className="block text-sm font-medium text-slate-700 mb-1.5">설명</label>
            <textarea id="description_modal" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={commonInputClass} placeholder="콘텐츠에 대한 간략한 설명" disabled={isSaving}/>
          </div>

          <div>
            <label htmlFor="category_modal" className="block text-sm font-medium text-slate-700 mb-1.5">카테고리 <span className="text-red-500">*</span></label>
            <select id="category_modal" value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className={`${commonInputClass} appearance-none`} required disabled={isSaving}>
              <option value="" disabled>카테고리를 선택하세요</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="projectUrl_edit_modal" className="block text-sm font-medium text-slate-700 mb-1.5">프로젝트 URL (선택 사항)</label>
            <input
              type="url"
              id="projectUrl_edit_modal"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className={commonInputClass}
              placeholder="https://example.com/my-project"
              disabled={isSaving}
            />
          </div>

          {/* 썸네일 이미지 섹션 시작 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">썸네일 이미지</label>
            {/* 현재/새 썸네일 미리보기 */}
            {(newThumbnailPreview || contentToEdit?.thumbnailUrl) && (
              <div className="mb-2">
                <p className="text-xs text-slate-500 mb-1">{newThumbnailPreview ? "새 썸네일 미리보기:" : "현재 썸네일:"}</p>
                <img
                  src={newThumbnailPreview || contentToEdit?.thumbnailUrl}
                  alt="썸네일 미리보기"
                  className="max-h-32 rounded-md shadow-sm"
                />
              </div>
            )}
            <label htmlFor="thumbnailFile_edit_modal" className={`mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 border-slate-300 border-dashed rounded-xl hover:border-purple-500 transition-colors duration-150 cursor-pointer bg-slate-50/50 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {!(newThumbnailPreview || contentToEdit?.thumbnailUrl) && ( // 아무 이미지도 없을 때만 아이콘 표시
                <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-2" />
              )}
              <div className={`flex text-sm ${isSaving ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className={`font-medium ${isSaving ? 'text-purple-400' : 'text-purple-600 hover:text-purple-500'}`}>새 썸네일 선택</span>
                <p className="pl-1">또는 드래그 앤 드롭</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF (최대 5MB)</p>
              {newThumbnailFile && <p className="text-xs text-green-600 mt-1">선택된 새 썸네일: {newThumbnailFile.name}</p>}
            </label>
            <input id="thumbnailFile_edit_modal" name="thumbnailFile_edit_modal" type="file" className="sr-only" onChange={handleNewThumbnailChange} accept="image/*" disabled={isSaving} />
          </div>
          {/* 썸네일 이미지 섹션 끝 */}

          {/* 콘텐츠 파일 섹션 시작 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">콘텐츠 파일 (선택 사항)</label>
            {/* 기존 파일 정보 표시 */}
            {contentToEdit?.filePath && !newContentFile && ( // 새 파일이 없을 때만 기존 파일 정보 표시
              <p className="text-xs text-slate-500 mb-1">현재 파일: {contentToEdit.filePath.split('/').pop()}</p>
            )}
            <label htmlFor="contentFile_edit_modal" className={`mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 border-slate-300 border-dashed rounded-xl hover:border-purple-500 transition-colors duration-150 cursor-pointer bg-slate-50/50 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <FileText className="mx-auto h-12 w-12 text-slate-400 mb-2" />
              <div className={`flex text-sm ${isSaving ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className={`font-medium ${isSaving ? 'text-purple-400' : 'text-purple-600 hover:text-purple-500'}`}>새 파일 선택</span>
                <p className="pl-1">또는 드래그 앤 드롭</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">HTML, ZIP, 이미지, 비디오 등</p>
              {newContentFile && <p className="text-xs text-green-600 mt-1">선택된 새 파일: {newContentFile.name}</p>}
            </label>
            <input id="contentFile_edit_modal" name="contentFile_edit_modal" type="file" className="sr-only" onChange={handleNewContentFileChange} disabled={isSaving} />
          </div>
          {/* 콘텐츠 파일 섹션 끝 */}
        </form>

        <div className="flex items-center justify-end p-5 border-t border-slate-200 space-x-3 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} type="button" className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors" disabled={isSaving}>
            취소
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            {isSaving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditContentModal;
