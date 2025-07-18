import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(typeof window !== 'undefined' && localStorage.getItem('platform_logged_in') === 'true');
  }, []);

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Platform Header for Admin */}
        <div className="text-center pt-16 pb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-comments text-white text-2xl"></i>
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Tawasl
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, Administrator!</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your platform content and help users improve their communication skills
          </p>
        </div>

        {/* Admin Management Cards */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/articles">
              <div className="bg-white rounded-3xl feature-card p-8 flex flex-col items-center card-hover cursor-pointer group border border-gray-100 hover:border-blue-200 transition-all duration-500 shadow-lg hover:shadow-2xl">
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <i className="fas fa-book-open text-3xl text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300"></i>
                </div>
                <h3 className="text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-800 transition-colors">Articles</h3>
                <p className="text-gray-600 text-center text-base leading-relaxed font-medium mb-4">
                  Create and manage expert articles on communication and presentation skills
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  <span>Manage Articles</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </Link>

            <Link href="/tests">
              <div className="bg-white rounded-3xl feature-card p-8 flex flex-col items-center card-hover cursor-pointer group border border-gray-100 hover:border-green-200 transition-all duration-500 shadow-lg hover:shadow-2xl">
                <div className="w-20 h-20 gradient-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <i className="fas fa-clipboard-check text-3xl text-green-500 group-hover:text-green-400 group-hover:scale-110 transition-all duration-300"></i>
                </div>
                <h3 className="text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-800 transition-colors">Tests</h3>
                <p className="text-gray-600 text-center text-base leading-relaxed font-medium mb-4">
                  Create and manage skill tests to evaluate communication abilities
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  <span>Manage Tests</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </Link>

            <Link href="/faq">
              <div className="bg-white rounded-3xl feature-card p-8 flex flex-col items-center card-hover cursor-pointer group border border-gray-100 hover:border-pink-200 transition-all duration-500 shadow-lg hover:shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <i className="fas fa-question-circle text-3xl text-pink-500 group-hover:text-pink-400 group-hover:scale-110 transition-all duration-300"></i>
                </div>
                <h3 className="text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-800 transition-colors">FAQ</h3>
                <p className="text-gray-600 text-center text-base leading-relaxed font-medium mb-4">
                  Manage frequently asked questions and platform information
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  <span>Manage FAQ</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Platform Introduction Section - Full Width */}
      <section className="mb-1 w-full section-intro flex flex-col md:flex-row items-center gap-12 shadow-lg p-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 leading-tight">
              Welcome to Tawasl!
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed font-medium">
              Tawasl helps you master communication and presentation skills with expert articles, interactive tests, AI-powered video analysis, and more. Start your journey to communication excellence today!
            </p>
            <div className="flex justify-center md:justify-start">
              <Link href="/video-practice">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center gap-4 transform hover:-translate-y-1">
                  <i className="fas fa-video text-2xl"></i>
                  <span>Try Video Analysis</span>
                  <i className="fas fa-arrow-right text-lg"></i>
                </button>
              </Link>
            </div>
          </div>
          <img src="https://img.icons8.com/color/480/000000/communication.png" alt="Platform Illustration" className="w-64 h-64 object-contain mx-auto md:mx-0 flex-shrink-0" />
        </div>
      </section>
      {/* Feature Cards Section - Enhanced Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover powerful tools designed to enhance your communication and presentation skills
          </p>
        </div>
        {/* Cards Grid - Optimized for 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
          <Link href="/articles">
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer group border border-gray-100 hover:border-blue-300 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 h-full">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-book-open text-3xl text-yellow-400 group-hover:text-yellow-300 transition-all duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-800 transition-colors">Articles</h3>
              <p className="text-gray-600 text-base leading-relaxed font-medium mb-6 flex-grow">
                Explore expert articles on communication and presentation skills to enhance your knowledge
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>Read Articles</span>
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </Link>
          <Link href="/tests">
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer group border border-gray-100 hover:border-green-300 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 h-full">
              <div className="w-20 h-20 gradient-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-clipboard-check text-3xl text-green-500 group-hover:text-green-400 transition-all duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-800 transition-colors">Tests</h3>
              <p className="text-gray-600 text-base leading-relaxed font-medium mb-6 flex-grow">
                Take skill tests to evaluate and improve your communication abilities with instant feedback
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>Take Tests</span>
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </Link>
          <Link href="/faq">
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer group border border-gray-100 hover:border-pink-300 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 h-full">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-question-circle text-3xl text-pink-500 group-hover:text-pink-400 transition-all duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-800 transition-colors">FAQ</h3>
              <p className="text-gray-600 text-base leading-relaxed font-medium mb-6 flex-grow">
                Find answers to frequently asked questions about the platform and get quick help
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>View FAQ</span>
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </Link>
          <Link href="/video-practice">
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer group border border-gray-100 hover:border-red-300 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 h-full">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-video text-3xl text-red-500 group-hover:text-red-400 transition-all duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-800 transition-colors">Video Practice</h3>
              <p className="text-gray-600 text-base leading-relaxed font-medium mb-6 flex-grow">
                Practice your communication skills with AI-powered video analysis and feedback
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>Try Video Practice</span>
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </Link>
          {/* About Card - Only visible on tablet screens */}
          <Link href="/about">
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer group border border-gray-100 hover:border-purple-300 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 h-full hidden md:flex xl:hidden">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-info-circle text-3xl text-purple-500 group-hover:text-purple-400 transition-all duration-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-800 transition-colors">About</h3>
              <p className="text-gray-600 text-base leading-relaxed font-medium mb-6 flex-grow">
                Learn more about the Tawasl platform, our mission, and how we help you grow.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>About Us</span>
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
