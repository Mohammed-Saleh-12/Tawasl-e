import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignupModal } from "@/components/signup-modal";
import { UserLoginModal } from "@/components/user-login-modal";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const [location] = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: "fas fa-home" },
    { href: "/articles", label: "Articles", icon: "fas fa-book-open" },
    { href: "/tests", label: "Skill Tests", icon: "fas fa-clipboard-check" },
    { href: "/faq", label: "FAQ", icon: "fas fa-question-circle" },
    { href: "/about", label: "About", icon: "fas fa-info-circle" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100" role="banner">
        <nav className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-10" aria-label="Main navigation">
          <div className="flex justify-between items-center h-18">
            <div className="flex flex-1 items-center">
              <div className="flex-shrink-0">
                <Link href="/" aria-label="Go to home page">
                  <div className="flex items-center space-x-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl">
                    <div className="w-8 h-8 md:w-10 md:h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <i className="fas fa-comments text-white text-sm md:text-lg" aria-hidden="true"></i>
                    </div>
                    <span className="text-2xl font-bold text-blue-700">
                      Tawasl
                    </span>
                  </div>
                </Link>
              </div>
              <div className="hidden lg:flex flex-1 justify-center">
                <ul className="flex items-center space-x-4">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} aria-label={`Go to ${item.label} page`} tabIndex={0}>
                        <div
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            isActive(item.href)
                              ? "text-primary bg-blue-50 shadow-sm"
                              : "text-gray-600 hover:text-primary hover:bg-blue-50/50"
                          }`}
                        >
                          <i className={`${item.icon} text-sm`} aria-hidden="true"></i>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center">
              {/* Desktop only: show Get Started/Logout button and Video Analysis button */}
              <div className="hidden md:flex items-center gap-4 mr-2 ml-auto">
                <Button
                  asChild
                  className="gradient-primary text-white hover:shadow-lg transition-all duration-200 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <Link href="/video-practice" aria-label="Go to video analysis page" tabIndex={0}>
                    <i className="fas fa-video mr-2" aria-hidden="true"></i>
                    Video Analysis
                  </Link>
                </Button>
                {!isLoggedIn ? (
                  <Button
                    className="gradient-primary text-white hover:shadow-lg transition-all duration-200 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => setSignupOpen(true)}
                  >
                    Get Started
                  </Button>
                ) : (
                  <Button
                    className="gradient-primary text-white hover:shadow-lg transition-all duration-200 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                )}
              </div>
              {/* Mobile Menu Button - Always visible on small screens */}
              <div className="flex md:hidden ml-2">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
                      <i className="fas fa-bars text-xl text-gray-600"></i>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64 p-0 bg-white">
                    <nav className="flex flex-col space-y-2 mt-10">
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href} aria-label={`Go to ${item.label} page`} tabIndex={0}>
                          <div
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              isActive(item.href)
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <i className={`${item.icon} text-sm w-5`} aria-hidden="true"></i>
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      ))}
                      <div className="pt-6 border-t border-gray-200 space-y-3 px-4">
                        <Button asChild className="w-full gradient-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                          <Link href="/video-practice" aria-label="Go to video analysis page" tabIndex={0}>
                            <i className="fas fa-video mr-2" aria-hidden="true"></i>
                            Video Analysis
                          </Link>
                        </Button>
                      </div>
                    </nav>
                    <div className="pt-6 border-t border-gray-200 space-y-3 px-4">
                      {/* Mobile only: show Get Started/Logout button */}
                      {!isLoggedIn ? (
                        <Button
                          className="w-full gradient-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onClick={() => { setSignupOpen(true); setIsMobileMenuOpen(false); }}
                        >
                          Get Started
                        </Button>
                      ) : (
                        <Button
                          className="w-full gradient-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        >
                          Logout
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <SignupModal open={isSignupOpen} onOpenChange={setSignupOpen} onSuccess={() => setLoginOpen(true)} />
      <UserLoginModal open={isLoginOpen} onOpenChange={setLoginOpen} onSuccess={() => {}} />
    </>
  );
}
