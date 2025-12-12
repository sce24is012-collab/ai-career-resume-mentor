import React, { useState } from 'react';
import { FileText, Clipboard, Play } from 'lucide-react';

interface ResumeInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 50) {
      onAnalyze(text);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Let's Optimize Your Career</h2>
          <p className="text-slate-500">Paste your resume text below to get an AI-powered comprehensive analysis, ATS score, and tailored career advice.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-slate-700 font-mono text-sm leading-relaxed"
              placeholder="Paste your resume content here..."
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute top-4 right-4 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Clipboard className="w-3 h-3" />
              Paste from Clipboard
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || text.trim().length < 50}
              className={`
                group relative px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all
                ${isLoading || text.trim().length < 50 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-200 hover:scale-105 active:scale-95'}
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Resume...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Analyze My Resume
                  <Play className="w-4 h-4 fill-current" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeInput;
