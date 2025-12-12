import React from 'react';
import { ResumeAnalysis } from '../types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, BookOpen, Briefcase } from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: ResumeAnalysis;
}

const ScoreGauge = ({ score }: { score: number }) => {
  const data = [{ name: 'Score', value: score, fill: score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }];
  
  return (
    <div className="h-64 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={20} data={data} startAngle={180} endAngle={0}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
        <span className="text-4xl font-bold text-slate-800">{score}</span>
        <p className="text-sm text-slate-500 font-medium">ATS Score</p>
      </div>
    </div>
  );
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Resume Health</h3>
          <ScoreGauge score={analysis.atsScore} />
        </div>
        
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            Executive Summary
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">{analysis.summary}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Top Strengths
              </h4>
              <ul className="space-y-1">
                {analysis.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-sm text-green-800">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Key Weaknesses
              </h4>
              <ul className="space-y-1">
                {analysis.weaknesses.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-sm text-amber-800">• {w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Skills Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technical</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.skills.technical.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-100">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Soft Skills</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.skills.soft.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-sky-50 text-sky-700 text-sm rounded-full border border-sky-100">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tools</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.skills.tools.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-700 text-sm rounded-full border border-slate-100">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Missing Skills & Issues
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Missing Critical Skills</h4>
              {analysis.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-100">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No major missing skills identified.</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Grammar & Formatting</h4>
              {analysis.grammarIssues.length > 0 ? (
                 <ul className="space-y-2">
                 {analysis.grammarIssues.map((issue, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                     <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                     {issue}
                   </li>
                 ))}
               </ul>
              ) : (
                <p className="text-sm text-green-600 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Clean formatting!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Improvements Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Suggested Improvements
        </h3>
        <div className="grid gap-4">
          {analysis.improvements.map((imp, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-red-500 uppercase">Original</span>
                  <p className="text-sm text-slate-600 line-through opacity-70">{imp.original}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase">Improved</span>
                  <p className="text-sm font-medium text-slate-800">{imp.suggestion}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200">
                 <p className="text-xs text-slate-500"><span className="font-semibold">Why:</span> {imp.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
