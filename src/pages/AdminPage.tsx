// src/pages/AdminPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, Book, AppWindow, Gamepad2, Film, PlusCircle, FilePenLine, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import AddContentModal from '../components/AddContentModal';
import { db, storage } from '../firebaseClient'; // storage might be used later for file deletion
import { collection, addDoc, serverTimestamp, Timestamp, getDocs, onSnapshot, orderBy, query, doc, deleteDoc } from 'firebase/firestore'; // Added doc, deleteDoc
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"; // Added deleteObject

interface CategoryDisplay {
  id: string;
  name: string;
  icon: React.ElementType;
  slug?: string;
  order?: number;
}

const categoryIconMap: { [key: string]: React.ElementType } = {
  blog: Book,
  app: AppWindow,
  game: Gamepad2,
  media: Film,
  default: LayoutGrid,
};

interface Content {
  id:string;
  category: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailPath?: string; // To store storage path for easier deletion
  fileUrl?: string;
  filePath?: string; // To store storage path for easier deletion
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  isPublished?: boolean;
  order?: number;
}


const AdminPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID of item being deleted for row-specific loading/disabled state

  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryDisplay[]>([]);

  const [contentsLoading, setContentsLoading] = useState<boolean>(true);
  const [contentsError, setContentsError] = useState<string | null>(null);
  const [contentsData, setContentsData] = useState<Content[]>([]);
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    setCategoriesLoading(true);
    const categoriesCol = collection(db, 'categories');
    const q_cat = query(categoriesCol, orderBy('order', 'asc'));

    getDocs(q_cat)
      .then((snapshot) => {
        const fetchedCategories = snapshot.docs.map(doc_item => {
          const data = doc_item.data();
          return {
            id: doc_item.id,
            name: data.name || doc_item.id,
            slug: data.slug || doc_item.id,
            order: data.order || 0,
            icon: categoryIconMap[doc_item.id.toLowerCase()] || categoryIconMap.default,
          };
        });
        setCategoriesData([{ id: 'all', name: 'All', icon: LayoutGrid, order: -1 }, ...fetchedCategories]);
        setCategoriesError(null);
      })
      .catch(err => {
        console.error("Error fetching categories: ", err);
        setCategoriesError("카테고리를 불러오는 중 오류가 발생했습니다.");
        setCategoriesData([{ id: 'all', name: 'All', icon: LayoutGrid, order: -1 }]);
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  }, []);

  useEffect(() => {
    setContentsLoading(true);
    const contentsCol = collection(db, 'contents');
    const q_cont = query(contentsCol, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q_cont, (snapshot) => {
      const fetchedContents = snapshot.docs.map(doc_item => ({
        id: doc_item.id,
        ...doc_item.data(),
      } as Content));
      setContentsData(fetchedContents);
      setContentsError(null);
      setContentsLoading(false);
    }, (err) => {
      console.error("Error fetching contents: ", err);
      setContentsError("콘텐츠를 불러오는 중 오류가 발생했습니다.");
      setContentsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddModalOpen = () => setIsAddModalOpen(true);
  const handleAddModalClose = () => {
    if (!isSavingContent) {
        setIsAddModalOpen(false);
    }
  };

  const uploadFile = async (file: File, type: 'thumbnail' | 'content_file'): Promise<{ downloadURL: string, filePath: string }> => {
    const uniqueFileName = `${type === 'thumbnail' ? 'thumb' : 'content'}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const path = `${type === 'thumbnail' ? 'thumbnails' : 'content_files'}/${uniqueFileName}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        () => {},
        (error) => { console.error("Upload error:", error); reject(error); },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve({ downloadURL, filePath: path });
          });
        }
      );
    });
  };

  const handleSaveContent = async (formData: any) => {
    setIsSavingContent(true);
    let localError = null; // Variable to track error within this function scope
    try {
      let thumbnailUrl = '';
      let thumbnailPath = '';
      let fileUrl = '';
      let filePath = '';

      if (formData.thumbnailFile) {
        const result = await uploadFile(formData.thumbnailFile, 'thumbnail');
        thumbnailUrl = result.downloadURL;
        thumbnailPath = result.filePath;
      }

      if (formData.contentFile) {
        const result = await uploadFile(formData.contentFile, 'content_file');
        fileUrl = result.downloadURL;
        filePath = result.filePath;
      }

      const contentDataToSave = {
        title: formData.title,
        description: formData.description || '',
        category: formData.category,
        thumbnailUrl,
        thumbnailPath,
        fileUrl,
        filePath,
        isPublished: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        order: 0,
      };

      await addDoc(collection(db, 'contents'), contentDataToSave);
      alert('콘텐츠가 성공적으로 추가되었습니다!');
    } catch (error) {
      localError = error; // Assign error to localError
      console.error("Error adding content: ", error);
      alert(`콘텐츠 추가 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSavingContent(false);
      if (!localError) { // Only close modal if no error occurred
        handleAddModalClose();
      }
    }
  };

  const handleDeleteContent = async (contentItem: Content) => {
    if (!window.confirm(`"${contentItem.title}" 콘텐츠를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }
    setIsDeleting(contentItem.id);
    try {
      await deleteDoc(doc(db, 'contents', contentItem.id));

      if (contentItem.thumbnailPath) {
        try {
          const thumbRef = ref(storage, contentItem.thumbnailPath);
          await deleteObject(thumbRef);
          console.log("Thumbnail deleted from Storage:", contentItem.thumbnailPath);
        } catch (storageError: any) {
          // Log soft error: if file not found, it's not critical as main doc is deleted.
          if (storageError.code === 'storage/object-not-found') {
            console.warn("Thumbnail file not found in Storage, maybe already deleted:", contentItem.thumbnailPath);
          } else {
            console.error("Error deleting thumbnail from Storage:", storageError);
          }
        }
      }
      if (contentItem.filePath) {
        try {
          const fileRef = ref(storage, contentItem.filePath);
          await deleteObject(fileRef);
          console.log("Content file deleted from Storage:", contentItem.filePath);
        } catch (storageError: any) {
          if (storageError.code === 'storage/object-not-found') {
            console.warn("Content file not found in Storage, maybe already deleted:", contentItem.filePath);
          } else {
            console.error("Error deleting content file from Storage:", storageError);
          }
        }
      }

      alert(`"${contentItem.title}" 콘텐츠가 성공적으로 삭제되었습니다.`);
    } catch (error) {
      console.error("Error deleting content: ", error);
      alert(`콘텐츠 삭제 중 오류 발생: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredContents = useMemo(() => {
    if (selectedCategory === 'all') return contentsData;
    return contentsData.filter(content => content.category === selectedCategory);
  }, [selectedCategory, contentsData]);

  const getCategoryNameById = (categoryId: string): string => {
    const foundCategory = categoriesData.find(c => c.id === categoryId && c.id !== 'all');
    return foundCategory?.name || categoryId;
  };

  const formatDate = (date: Timestamp | Date | undefined): string => {
    if (!date) return 'N/A';
    const d = (date instanceof Timestamp) ? date.toDate() : date;
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const modalCategories = useMemo(() => categoriesData.filter(cat => cat.id !== 'all'), [categoriesData]);

  if (categoriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <p className="text-slate-700 text-lg">카테고리 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">관리자 페이지</h1>
        <p className="text-slate-600 text-base p-4 bg-slate-100 rounded-lg shadow-sm mt-2">콘텐츠를 효율적으로 관리하고 새로운 내용을 추가하세요.</p>
      </header>

      {categoriesError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center shadow-sm">
          <AlertTriangle size={20} className="mr-3 flex-shrink-0" />
          {categoriesError}
        </div>
      )}

      <section className="mb-8 p-5 bg-white shadow-lg rounded-xl">
        <div className="flex items-center mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700">카테고리 필터</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {categoriesData.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2.5 text-sm md:text-base font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-60 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
                  ${isActive
                    ? 'bg-purple-600 text-white focus:ring-purple-400 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400'
                  }
                `}
              >
                <Icon size={16} className="mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white shadow-lg rounded-xl p-5">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700">
            콘텐츠 목록 <span className="text-purple-600 font-normal">({selectedCategory === 'all' ? 'All' : categoriesData.find(c=>c.id===selectedCategory)?.name})</span>
          </h2>
          <button
            onClick={handleAddModalOpen}
            className="flex items-center justify-center w-full md:w-auto px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105">
            <PlusCircle size={18} className="mr-2" />
            Add Content
          </button>
        </div>

        {contentsLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-3" />
            <p className="text-slate-600">콘텐츠를 불러오는 중...</p>
          </div>
        )}
        {contentsError && (
          <div className="my-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center shadow-sm">
            <AlertTriangle size={20} className="mr-3 flex-shrink-0" />
            {contentsError}
          </div>
        )}

        {!contentsLoading && !contentsError && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">카테고리</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">제목</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">수정일</th>
                  <th scope="col" className="px-5 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredContents.length > 0 ? (
                  filteredContents.map((content, index) => (
                    <tr key={content.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-purple-50/50 transition-colors duration-150 ${isDeleting === content.id ? 'opacity-50' : ''}`}>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700">{getCategoryNameById(content.category)}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">{content.title}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(content.updatedAt)}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          className="p-1.5 text-blue-600 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors duration-150 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Modify"
                          disabled={!!isDeleting || isSavingContent} // Simplified disable logic
                          onClick={() => alert('수정 기능은 곧 구현될 예정입니다!')}
                        >
                          <FilePenLine size={18} />
                        </button>
                        <button
                          className="p-1.5 text-red-600 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                          onClick={() => handleDeleteContent(content)}
                          disabled={!!isDeleting || isSavingContent} // Simplified disable logic
                        >
                          {isDeleting === content.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                      {selectedCategory === 'all' && contentsData.length === 0 && !contentsLoading ? '등록된 콘텐츠가 없습니다. "Add Content" 버튼을 눌러 새 콘텐츠를 추가해보세요.' : '이 카테고리에는 아직 콘텐츠가 없습니다.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onSave={handleSaveContent}
        categories={modalCategories}
        isSaving={isSavingContent}
      />
    </div>
  );
};
export default AdminPage;
