// src/components/AddContentModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, UploadCloud, Image as ImageIcon, FileText, Loader2 } from 'lucide-react'; // Added Loader2

interface Category {
  id: string;
  name: string;
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>; // Changed to Promise for async handling
  categories: Category[];
  isSaving: boolean; // New prop for loading state
}

const AddContentModal: React.FC<AddContentModalProps> = ({ isOpen, onClose, onSave, categories, isSaving }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);


  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    if (categories.length > 0) {
      const firstValidCategory = categories.find(c => c.id !== 'all');
      setSelectedCat(firstValidCategory?.id || categories[0]?.id || '');
    } else {
      setSelectedCat('');
    }
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setContentFile(null);
  }, [categories]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => { // Made async
    e.preventDefault();
    if (!title || !selectedCat) {
      alert('제목과 카테고리는 필수입니다.');
      return;
    }
    await onSave({ title, description, category: selectedCat, thumbnailFile, contentFile });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailFile(null);
      setThumbnailPreview(null);
    }
  };

  const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContentFile(e.target.files[0]);
    } else {
      setContentFile(null);
    }
  };

  const commonInputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150 ease-in-out placeholder-slate-400 text-slate-700 bg-slate-50";
  const fileInputAreaBaseClass = "mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 border-slate-300 border-dashed rounded-xl hover:border-purple-500 transition-colors duration-150 cursor-pointer bg-slate-50/50";

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" onClick={isSaving ? undefined : onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalEnter"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">새 콘텐츠 추가</h2>
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">썸네일 이미지</label>
            <label htmlFor="thumbnailFile_modal" className={`${fileInputAreaBaseClass} ${thumbnailPreview ? 'border-green-500' : ''} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail preview" className="max-h-32 rounded-md mb-3 shadow-sm"/>
              ) : (
                <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-2" />
              )}
              <div className={`flex text-sm ${isSaving ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className={`font-medium ${isSaving ? 'text-purple-400' : 'text-purple-600 hover:text-purple-500'}`}>파일 선택</span>
                <p className="pl-1">또는 드래그 앤 드롭</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF (최대 5MB)</p>
              {thumbnailFile && !thumbnailPreview && <p className="text-xs text-green-600 mt-1">선택된 파일: {thumbnailFile.name}</p>}
            </label>
            <input id="thumbnailFile_modal" name="thumbnailFile_modal" type="file" className="sr-only" onChange={handleThumbnailChange} accept="image/*" disabled={isSaving} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">콘텐츠 파일 (선택)</label>
            <label htmlFor="contentFileInput_modal" className={`${fileInputAreaBaseClass} ${contentFile ? 'border-green-500' : ''} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <FileText className="mx-auto h-12 w-12 text-slate-400 mb-2" />
              <div className={`flex text-sm ${isSaving ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className={`font-medium ${isSaving ? 'text-purple-400' : 'text-purple-600 hover:text-purple-500'}`}>파일 선택</span>
                <p className="pl-1">또는 드래그 앤 드롭</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">HTML, ZIP, 이미지, 비디오 등</p>
              {contentFile && <p className="text-xs text-green-600 mt-1">선택된 파일: {contentFile.name}</p>}
            </label>
            <input id="contentFileInput_modal" name="contentFileInput_modal" type="file" className="sr-only" onChange={handleContentFileChange} disabled={isSaving} />
          </div>
        </form>

        <div className="flex items-center justify-end p-5 border-t border-slate-200 space-x-3 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} type="button" className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors" disabled={isSaving}>
            취소
          </button>
          <button
            onClick={handleSubmit} // Changed from type="submit" to onClick to explicitly call async handleSubmit
            type="button"      // Ensure it's not a submit button by default if form has one.
            className="flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            {isSaving ? '저장 중...' : '콘텐츠 저장'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddContentModal;
