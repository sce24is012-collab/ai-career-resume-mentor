import React, { useState } from 'react';
import { generateResource } from '../services/geminiService';
import { PenTool, Mail, UserCircle, Sparkles, Copy, Check } from 'lucide-react';

interface ToolsProps {
  resumeContext: string;
}

const Tools: React.FC<ToolsProps> = ({ resumeContext }) => {
  const [activeTab, setActiveTab] = useState<'headline' | 'bio' | 'email'>('headline');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [extraContext, setExtraContext] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await generateResource(activeTab, resumeContext, extraContext);
      setResult(res);
    } catch (e) {
      setResult("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Career Toolkit
        </h2>
        <p className="text-slate-500 mt-2">Generate professional content instantly based on your resume.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => { setActiveTab('headline'); setResult(""); }}
            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'headline' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <UserCircle className="w-5 h-5" />
            <span className="font-medium">LinkedIn Headline</span>
          </button>
          <button
            onClick={() => { setActiveTab('bio'); setResult(""); }}
            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'bio' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <PenTool className="w-5 h-5" />
            <span className="font-medium">Professional Bio</span>
          </button>
          <button
            onClick={() => { setActiveTab('email'); setResult(""); }}
            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'email' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">Cold Email</span>
          </button>
        </div>

        {/* Generator Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()} Generator</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                {activeTab === 'email' ? 'Target Company & Role (Optional)' : 'Additional Context (Optional)'}
              </label>
              <input
                type="text"
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                placeholder={activeTab === 'email' ? "e.g., Software Engineer at Google" : "e.g., Focus on leadership skills"}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   Generating...
                 </>
              ) : (
                <>Generate <Sparkles className="w-4 h-4" /></>
              )}
            </button>

            {result && (
              <div className="mt-6 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Result</span>
                  <button onClick={handleCopy} className="text-slate-400 hover:text-purple-600 transition-colors">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
