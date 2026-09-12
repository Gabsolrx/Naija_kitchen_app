import React from 'react';
import { TopBar } from '../components/TopBar';
import { useAppContext } from '../context/AppContext';
import { Info, Mail, Code, Sparkles, AlertTriangle } from 'lucide-react';

export function About() {
  const { aboutContent } = useAppContext();

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <TopBar title="About App" />
      
      <div className="flex-1 overflow-y-auto p-6 pb-32 flex flex-col items-center">
        <div className="w-24 h-24 bg-[var(--color-brand-orange)] rounded-full flex items-center justify-center text-white font-bold text-5xl leading-none pt-2 shadow-xl shadow-orange-500/20 mb-6">
          N
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">{aboutContent.title}</h1>
        <p className="text-gray-500 font-medium mb-8 text-sm bg-gray-200 px-3 py-1 rounded-full">Version {aboutContent.version}</p>
        
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Our Mission</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{aboutContent.description}</p>
            </div>
          </div>
          
          <div className="h-px w-full bg-gray-100 my-6" />
          
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-50 text-purple-500 rounded-xl shrink-0">
              <Code size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Developer</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{aboutContent.developerInfo}</p>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100 my-6" />
          
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Disclaimer</h3>
              <p className="text-gray-600 text-sm leading-relaxed">The recipes and nutritional information provided in this app are for general informational purposes only. Please consult with a healthcare professional or nutritionist for specific dietary needs or medical conditions.</p>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100 my-6" />
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 text-green-500 rounded-xl shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Contact Us</h3>
              <p className="text-gray-600 text-sm leading-relaxed">naijakitchens2@gmail.com</p>
              <a href={`mailto:naijakitchens2@gmail.com`} className="text-[var(--color-brand-orange)] text-sm font-bold mt-2 inline-block">Send an email</a>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-4">
          © {new Date().getFullYear()} {aboutContent.title}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
