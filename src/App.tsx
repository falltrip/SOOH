import React, { useState, useEffect } from "react"; // Added useEffect
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { User as LucideUser, BookOpen, AppWindow, Gamepad2, Film, Menu } from "lucide-react"; // Renamed User to LucideUser to avoid conflict
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { auth } from './firebaseClient'; // Import auth
import { onAuthStateChanged, User } from 'firebase/auth'; // Import onAuthStateChanged and User type
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import Hero from "./components/Hero";
import Section from "./components/Section";
import Footer from "./components/Footer"; // Import Footer
import AdminPage from "./pages/AdminPage"; // Import the new AdminPage
import ContentDetailPage from './pages/ContentDetailPage';

const ADMIN_EMAIL = "falltrip97@gmail.com";

// Placeholder AdminPage component has been removed

const sections = [
  {
    id: "profile",
    title: "Profile",
    icon: LucideUser, // Corrected: Was User, should be LucideUser
    description:
      "Full-stack developer passionate about creating beautiful web experiences",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
  },
  {
    id: "blog",
    title: "Blog",
    icon: BookOpen,
    description:
      "Sharing thoughts and experiences about web development and technology",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: "app",
    title: "App",
    icon: AppWindow,
    description:
      "Showcase of my application development projects and experiments",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
  },
  {
    id: "game",
    title: "Game",
    icon: Gamepad2,
    description: "Interactive games and gaming-related projects",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc",
  },
  {
    id: "media",
    title: "Media",
    icon: Film,
    description: "Collection of media projects and creative works",
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb",
  },
];

function App() {
  const [activeSection, setActiveSection] = React.useState("hero");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(user?.email === ADMIN_EMAIL);
      setLoadingAuthState(false);
      // console.log("Auth state changed, user:", user);
      // If user is logged in, close modals, otherwise they might stay open if login happens while modal is up.
      if (user) {
        setIsSignInModalOpen(false);
        setIsSignUpModalOpen(false);
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pathParam = params.get('p'); // 예: /app/콘텐츠ID
    const queryParam = params.get('q'); // 예: 원래 쿼리스트링 값

    // console.log('404 Handler: pathParam=', pathParam, 'queryParam=', queryParam, 'hash=', location.hash);

    if (pathParam) {
      let targetPath = pathParam;
      if (queryParam) {
        targetPath += `?${queryParam.replace(/~and~/g, '&')}`;
      }
      // location.hash는 URL에 #이 있으면 #someHash 형태로 반환. 없으면 빈 문자열.
      // navigate 함수는 경로에 해시가 포함된 문자열을 잘 처리합니다.
      targetPath += location.hash;

      // console.log('404 Handler: Navigating to', targetPath);
      navigate(targetPath, { replace: true });
    }
  }, [location, navigate]); // location 객체가 바뀔 때마다 실행

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const openSignInModal = () => {
    setIsSignInModalOpen(true);
    setIsSignUpModalOpen(false);
  };
  const closeSignInModal = () => setIsSignInModalOpen(false);

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
    setIsSignInModalOpen(false);
  };
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  const switchToSignUp = () => {
    openSignUpModal();
  };

  const switchToSignIn = () => {
    openSignInModal();
  };

  if (loadingAuthState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading application...</div>
        {/* You could replace this with a more sophisticated spinner component */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        openSignInModal={openSignInModal}
        currentUser={currentUser}
        isAdmin={isAdmin}
      />

      <Navbar
        sections={sections}
        activeSection={activeSection}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        // currentUser and isAdmin props removed
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                {sections.map((section) => (
                  <Section
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    description={section.description}
                    image={section.image}
                    Icon={section.icon}
                  />
                ))}
                <Footer />
              </>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/:category/:id" element={<ContentDetailPage />} />
        </Routes>
      </main>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        onSwitchToSignUp={switchToSignUp}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={closeSignUpModal}
        onSwitchToSignIn={switchToSignIn}
      />
      {/* Footer is now part of the / route's element */}
    </div>
  );
}

export default App;
