import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUserPlus } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export function SignupModal({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    if (!username.trim()) {
      setUsernameError("Username is required.");
      valid = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      valid = false;
    }
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
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      await apiClient.post("/register", { username, email, password });
      setShowCodeModal(true);
    } catch (err: any) {
      // Try to show backend error in a user-friendly way
      let msg = err.message || "Signup failed";
      if (msg.toLowerCase().includes("email")) setEmailError(msg);
      else if (msg.toLowerCase().includes("password")) setPasswordError(msg);
      else if (msg.toLowerCase().includes("username")) setUsernameError(msg);
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");
    setCodeLoading(true);
    try {
      await apiClient.post("/verify-email", { email, code });
      setSuccess("Account verified! You can now log in.");
      setTimeout(() => {
        setSuccess("");
        setShowCodeModal(false);
        onSuccess();
        onOpenChange(false);
      }, 1200);
    } catch (err: any) {
      setCodeError(err.message || "Invalid code");
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="flex flex-col items-center">
            <Avatar className="mb-2 h-16 w-16 bg-blue-100">
              <AvatarImage src="/public/favicon.svg" alt="Signup" />
              <AvatarFallback><FaUserPlus className="text-blue-600 text-2xl" /></AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl font-bold">Sign Up</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.location.href = "/api/auth/google"}
            >
              <FcGoogle className="text-xl" /> Sign up with Google
            </Button>
            <div className="flex items-center my-2">
              <span className="flex-1 h-px bg-gray-200" />
              <span className="mx-2 text-gray-400 text-xs">or</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
            {usernameError && (
              <div className="text-red-500 text-xs mb-1 ml-1 animate-pulse">{usernameError}</div>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
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
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-xl font-bold">Enter Verification Code</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVerifyCode} className="space-y-4 mt-2">
            <Input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={codeLoading}>
              {codeLoading ? "Verifying..." : "Verify"}
            </Button>
            {codeError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{codeError}</AlertDescription>
              </Alert>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 