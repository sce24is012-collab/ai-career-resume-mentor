import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import ResumeInput from './components/ResumeInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import CareerPaths from './components/CareerPaths';
import Tools from './components/Tools';
import ChatInterface from './components/ChatInterface';
import { analyzeResume } from './services/geminiService';
import { ResumeAnalysis } from './types';
import { LayoutDashboard, Map, Sparkles, MessageSquare, Menu, X, ArrowLeft } from 'lucide-react';

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  disabled?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, children, disabled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  if (disabled) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 text-slate-300 cursor-not-allowed">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{children}</span>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // We can access analysis state here via context if needed, but for simplicity we pass it down.
  // Actually, to know if links are enabled, we need to know if analysis exists.
  // In a real app we'd use Context. Here we'll rely on the parent wrapper props injection pattern or simple state checks in routes.
  
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-8 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">CP</span>
             </div>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">CareerPulse</h1>
           </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
           {children}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 text-center">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">CP</span>
             </div>
             <h1 className="text-xl font-bold text-slate-800">CareerPulse</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-10 pt-20 px-4 space-y-2">
          {children}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pt-20 lg:pt-0 p-4 lg:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Routes>
             <Route path="/analysis" element={<Outlet />} />
          </Routes>
          {/* We render children content via Router Outlet concept implicitly by passing the Route elements in App */}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (text: string) => {
    setLoading(true);
    try {
      const result = await analyzeResume(text);
      setAnalysis(result);
      setResumeText(text);
    } catch (error) {
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasData = !!analysis;

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* If no data, show input screen only (unless loading) */}
        {!hasData && !loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
             <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
                  <span className="text-white font-bold text-3xl">CP</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">CareerPulse AI</h1>
                <p className="text-slate-500">Your Personal AI Career Mentor</p>
             </div>
             <ResumeInput onAnalyze={handleAnalyze} isLoading={loading} />
          </div>
        ) : !hasData && loading ? (
           <div className="min-h-screen flex flex-col items-center justify-center p-4">
             <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
             <p className="text-lg font-medium text-slate-600">Analyzing your profile...</p>
             <p className="text-sm text-slate-400 mt-2">This usually takes about 10-15 seconds.</p>
           </div>
        ) : (
          <div className="flex min-h-screen">
             {/* Sidebar Navigation */}
             <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 fixed h-full z-10">
                <div className="p-8 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">CP</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">CareerPulse</h1>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  <NavLink to="/" icon={LayoutDashboard}>Analysis Dashboard</NavLink>
                  <NavLink to="/paths" icon={Map}>Career Paths</NavLink>
                  <NavLink to="/tools" icon={Sparkles}>Career Toolkit</NavLink>
                  <NavLink to="/chat" icon={MessageSquare}>Mentor Chat</NavLink>
                </nav>
                <div className="p-4">
                   <button 
                     onClick={() => { setAnalysis(null); setResumeText(""); }}
                     className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors"
                   >
                     <ArrowLeft className="w-4 h-4" /> Upload New Resume
                   </button>
                </div>
             </aside>

             {/* Mobile Nav Overlay omitted for brevity, standard responsive behavior applies to main content */}

             <main className="flex-1 lg:ml-72 p-4 lg:p-8 bg-slate-50 min-h-screen">
               <div className="max-w-6xl mx-auto">
                 {/* Mobile Header Placeholder for spacing */}
                 <div className="lg:hidden mb-6 flex justify-between items-center">
                    <h1 className="font-bold text-xl">CareerPulse</h1>
                    <button onClick={() => setAnalysis(null)} className="text-sm text-blue-600 font-medium">New Resume</button>
                 </div>
                 
                 {/* Mobile Nav Bar (Simple Bottom Bar for mobile) */}
                 <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around z-50">
                    <Link to="/" className="p-2 text-slate-600"><LayoutDashboard /></Link>
                    <Link to="/paths" className="p-2 text-slate-600"><Map /></Link>
                    <Link to="/tools" className="p-2 text-slate-600"><Sparkles /></Link>
                    <Link to="/chat" className="p-2 text-slate-600"><MessageSquare /></Link>
                 </div>

                 <Routes>
                   <Route path="/" element={<AnalysisDashboard analysis={analysis!} />} />
                   <Route path="/paths" element={<CareerPaths paths={analysis!.careerPaths} />} />
                   <Route path="/tools" element={<Tools resumeContext={resumeText} />} />
                   <Route path="/chat" element={<ChatInterface resumeContext={resumeText} />} />
                   <Route path="*" element={<Navigate to="/" replace />} />
                 </Routes>
               </div>
             </main>
          </div>
        )}
      </div>
    </HashRouter>
  );
}

// Helper component for nested routes if needed, effectively handled by main App structure
const Outlet = () => null; 

export default App;