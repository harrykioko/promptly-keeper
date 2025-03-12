
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Templates from "./pages/Templates";
import Documents from "./pages/Documents";
import AITools from "./pages/AITools";
import Profile from "./pages/Profile";
import { cn } from "./lib/utils";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Effect to watch for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarChange = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setIsSidebarCollapsed(sidebar.offsetWidth < 100);
      }
    };

    // Initial check
    handleSidebarChange();

    // Set up a mutation observer to detect changes to the sidebar's class
    const observer = new MutationObserver(handleSidebarChange);
    const sidebar = document.querySelector('aside');
    
    if (sidebar) {
      observer.observe(sidebar, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen flex">
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="*"
                  element={
                    <>
                      <Sidebar />
                      <main className={cn(
                        "flex-1 p-8 transition-all",
                        isSidebarCollapsed ? "ml-16" : "ml-64"
                      )}>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/templates" element={<Templates />} />
                          <Route path="/documents" element={<Documents />} />
                          <Route path="/ai-tools" element={<AITools />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </>
                  }
                />
              </Routes>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
