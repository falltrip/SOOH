// src/components/EditContentModal.tsx
import React, { useState, useEffect } from 'react'; // Removed useCallback
import { X, Loader2 } from 'lucide-react'; // Removed UploadCloud, ImageIcon, FileText

interface Category {
  id: string;
  name: string;
}

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: { title: string; description: string; category: string }) => Promise<void>;
  categories: Category[];
  isSaving: boolean;
  contentToEdit: {
    id: string;
    title: string;
    description?: string;
    category: string;
    thumbnailUrl?: string;
    fileUrl?: string;
  } | null;
}

const EditContentModal: React.FC<EditContentModalProps> = ({ isOpen, onClose, onSave, categories, isSaving, contentToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('');

  useEffect(() => {
    if (isOpen && contentToEdit) {
      setTitle(contentToEdit.title || '');
      setDescription(contentToEdit.description || '');
      setSelectedCat(contentToEdit.category || '');
    } else if (isOpen) { // contentToEdit가 null인데 열린 경우 (초기화 목적 또는 오류 방지)
      setTitle('');
      setDescription('');
      if (categories.length > 0) {
        const firstValidCategory = categories.find(c => c.id !== 'all');
        setSelectedCat(firstValidCategory?.id || categories[0]?.id || '');
      } else {
        setSelectedCat('');
      }
    }
  }, [isOpen, contentToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedCat) {
      alert('제목과 카테고리는 필수입니다.');
      return;
    }
    await onSave({ title, description, category: selectedCat });
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
          {/* File upload sections are removed */}
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
