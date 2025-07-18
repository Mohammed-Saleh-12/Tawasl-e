import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FcGoogle } from "react-icons/fc";
import { apiClient } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function UserLoginModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await apiClient.post("/login", { email, password });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      // Try to show backend error in a user-friendly way
      let msg = err.message || "Login failed";
      if (msg.toLowerCase().includes("email")) setEmailError(msg);
      else if (msg.toLowerCase().includes("password")) setPasswordError(msg);
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-col items-center">
          <Avatar className="mb-2 h-16 w-16">
            <AvatarImage src="/public/favicon.svg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <DialogTitle className="text-2xl font-bold">User Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          {emailError && (
            <div className="text-red-500 text-xs mb-1 ml-1 animate-pulse">{emailError}</div>
          )}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {passwordError && (
            <div className="text-red-500 text-xs mb-1 ml-1 animate-pulse">{passwordError}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleLogin}>
            <FcGoogle className="text-xl" /> Login with Google
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
} 