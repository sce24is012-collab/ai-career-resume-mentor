import React from 'react';
import { CareerPath } from '../types';
import { Map, ChevronRight, Target } from 'lucide-react';

interface CareerPathsProps {
  paths: CareerPath[];
}

const CareerPaths: React.FC<CareerPathsProps> = ({ paths }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Map className="w-8 h-8 text-blue-600" />
          Recommended Career Paths
        </h2>
        <p className="text-slate-500 mt-2">Based on your skills and experience, here are the best roles for you to target next.</p>
      </div>

      <div className="grid gap-6">
        {paths.map((path, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{path.role}</h3>
                  <p className="text-slate-600 mt-1 text-sm">{path.matchReason}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                   <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Development Roadmap</h4>
              <div className="relative">
                 {/* Timeline Line */}
                 <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                 
                 <div className="space-y-6">
                   {path.roadmap.map((step, sIdx) => (
                     <div key={sIdx} className="relative flex items-start gap-4">
                       <div className="absolute left-4 top-2 -ml-[5px] w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                       <div className="pl-8">
                         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700 text-sm">
                           {step}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerPaths;
