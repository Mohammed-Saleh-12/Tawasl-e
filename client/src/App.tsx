import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Tests from "@/pages/tests";
import FAQ from "@/pages/faq";
import VideoPractice from "@/pages/video-practice";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Login from "@/pages/login";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useEffect } from "react";
import About from "@/pages/about";

function Router() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isLoggedIn && <Header />}
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/articles" component={Articles} />
          <Route path="/tests" component={Tests} />
          <Route path="/faq" component={FAQ} />
          <Route path="/video-practice" component={VideoPractice} />
          <Route path="/login" component={Login} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
