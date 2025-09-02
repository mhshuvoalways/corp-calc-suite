import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "You have been logged in successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (signupPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!gdprConsent) {
      toast({
        title: "GDPR Consent Required",
        description:
          "Please accept the privacy policy and terms of service to continue.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account Exists",
            description:
              "An account with this email already exists. Please try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Check Your Email",
          description:
            "We've sent you a confirmation link. Please check your email to complete registration.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary">
      <Header />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

            <Card className="bg-primary/10 backdrop-blur-lg border-white/20 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-white">
                  {t('auth.welcomeBack')}
                </CardTitle>
                <CardDescription className="text-center text-white/80">
                  {t('auth.signInDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t('auth.signIn')}</TabsTrigger>
                    <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-white">
                          {t('auth.email')}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="pl-10 bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-secondary"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-white">
                          {t('auth.password')}
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pl-10 bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-secondary"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        variant="secondary"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : t('auth.signIn')}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-white">
                          {t('auth.email')}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="pl-10 bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-secondary"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-white">
                          {t('auth.password')}
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="pl-10 bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-secondary"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-white">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-secondary"
                            required
                          />
                        </div>
                      </div>

                      {/* GDPR Consent */}
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="gdpr-consent"
                          checked={gdprConsent}
                          onCheckedChange={(checked) =>
                            setGdprConsent(checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor="gdpr-consent"
                            className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                          >
                            I agree to the{" "}
                            <Link
                              to="/privacy"
                              className="text-secondary underline hover:no-underline"
                            >
                              Privacy Policy
                            </Link>{" "}
                            and{" "}
                            <Link
                              to="/terms"
                              className="text-secondary underline hover:no-underline"
                            >
                              Terms of Service
                            </Link>
                            . I consent to the processing of my personal data in
                            accordance with GDPR regulations.
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="secondary"
                        className="w-full"
                        disabled={loading || !gdprConsent}
                      >
                        {loading ? "Creating Account..." : t('auth.createAccount')}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
