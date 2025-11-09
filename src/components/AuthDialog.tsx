import { useState } from "react";
import { useMutation } from "@/hooks/use-graphql";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LOGIN, REGISTER } from "@/lib/graphql/mutations";
import { GET_ME } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql-client";
import { toast } from "sonner";

interface AuthDialogProps {
  children: React.ReactNode;
}

const AuthDialog = ({ children }: AuthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { mutate: login, loading: loginLoading } = useMutation(LOGIN, {
    onCompleted: (data: any) => {
      localStorage.setItem("authToken", data.login.token);
      graphqlClient.refetchQueries([GET_ME]);
      toast.success("Logged in successfully");
      setIsOpen(false);
      setLoginForm({ email: "", password: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const { mutate: register, loading: registerLoading } = useMutation(REGISTER, {
    onCompleted: (data: any) => {
      localStorage.setItem("authToken", data.register.token);
      graphqlClient.refetchQueries([GET_ME]);
      toast.success("Account created successfully");
      setIsOpen(false);
      setRegisterForm({ email: "", password: "", name: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        input: {
          email: loginForm.email,
          password: loginForm.password,
        },
      });
    } catch (error) {
      // Error handled by onError
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        input: {
          email: registerForm.email,
          password: registerForm.password,
          name: registerForm.name,
        },
      });
    } catch (error) {
      // Error handled by onError
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registerName">Name</Label>
                <Input
                  id="registerName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email</Label>
                <Input
                  id="registerEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerPassword">Password</Label>
                <Input
                  id="registerPassword"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={registerLoading}>
                {registerLoading ? "Creating account..." : "Register"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

