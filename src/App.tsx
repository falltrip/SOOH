import React, { useState } from "react";
import { User, BookOpen, AppWindow, Gamepad2, Film, Menu } from "lucide-react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import Section from "./components/Section";

const sections = [
  {
    id: "profile",
    title: "Profile",
    icon: User,
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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      <Navbar sections={sections} activeSection={activeSection} />

      <main>
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
      </main>
    </div>
  );
}

export default App;
