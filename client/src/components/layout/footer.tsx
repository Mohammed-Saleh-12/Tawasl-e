import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function Footer() {
  const { isLoggedIn, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  return (
    <footer className="bg-gradient-to-r from-blue-100 via-white to-blue-100 border-t border-gray-200 py-8 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-gray-600 text-base mb-2 md:mb-0 font-semibold">
          <span
            className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setLocation("/login")}
            title="Admin Login"
          >
            <i className="fas fa-comments text-white text-lg"></i>
          </span>
          <span className="font-bold text-blue-700 text-xl">Tawasl</span>
          <span className="hidden md:inline text-gray-400 font-normal">|</span>
          <span className="text-gray-400 font-normal">&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="flex flex-col items-center gap-1 text-right">
              <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                <i className="fas fa-code text-blue-600"></i>
                Made By Developer Mohamed Saleh
              </span>
              <a
                href="mailto:nmr.12.sh@gmail.com"
                className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-envelope"></i>
                nmr.12.sh@gmail.com
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={logout}
                className="btn-outline btn-enhanced"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
