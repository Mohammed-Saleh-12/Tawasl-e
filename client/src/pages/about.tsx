import React from "react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">About Tawasl</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          <strong>Tawasl</strong> is an innovative educational platform designed to empower learners and educators with interactive tools, high-quality content, and a seamless user experience. Our platform offers a diverse range of articles, skill tests, video analysis, and a comprehensive FAQ to support your learning journey. Whether you are a student seeking knowledge or an educator aiming to share expertise, Tawasl provides the resources and community to help you succeed.
        </p>
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Platform Features</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Curated educational articles across various subjects</li>
          <li>Skill assessment tests to track your progress</li>
          <li>AI-powered video analysis for practical learning</li>
          <li>Comprehensive FAQ for instant support</li>
          <li>Modern, user-friendly interface accessible on all devices</li>
        </ul>
      </div>
      <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 border-2 border-blue-200 rounded-2xl p-8 shadow-xl flex flex-col items-center mt-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-200 mb-4 shadow-md">
          <i className="fas fa-users text-3xl text-blue-700" aria-hidden="true"></i>
        </div>
        <div className="text-2xl font-bold text-blue-800 mb-2 tracking-wide">Meet the Team</div>
        <div className="text-gray-700 text-center mb-2 text-lg font-medium">
          Mohammed Saleh &ndash; Tasneem Al-Munajjid &ndash; Nour Al-Nabulsi
        </div>
        <div className="text-gray-600 text-base italic mt-2">
          Presenting this platform, hoping that users will find benefit from it.
        </div>
      </div>
    </div>
  );
} 