import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Mountain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Алдаа',
        description: 'Имэйл болон нууц үгээ оруулна уу',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        toast({
          title: 'Нэвтрэх амжилтгүй',
          description: 'Имэйл эсвэл нууц үг буруу байна',
          variant: 'destructive'
        });
      } else if (result.needsOtp) {
        toast({
          title: 'Төхөөрөмж баталгаажуулах',
          description: 'Шинэ төхөөрөмж илрүүллээ. OTP код оруулна уу'
        });
      } else {
        toast({
          title: 'Амжилттай нэвтэрлээ',
          description: 'Таван Богд групп-д тавтай морил!'
        });
      }
    } catch (error) {
      toast({
        title: 'Алдаа гарлаа',
        description: 'Дахин оролдоно уу',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoAccounts = [
    { email: 'batbayar@tavanbogd.mn', password: '123456', name: 'Батбаяр (Програмист)' },
    { email: 'sarangerel@tavanbogd.mn', password: '123456', name: 'Сарангэрэл (HR)' },
    { email: 'admin@tavanbogd.mn', password: 'admin', name: 'Админ' }
  ];

  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-[var(--shadow-primary)]">
            <Mountain className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Таван Богд</h1>
            <p className="text-muted-foreground">Ажилтны мобайл апп</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="card-corporate">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold">Нэвтрэх</CardTitle>
            <p className="text-sm text-muted-foreground">
              Өөрийн эрхээр нэвтэрнэ үү
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Имэйл хаяг</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@tavanbogd.mn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Нууц үг</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Нууц үгээ оруулна уу"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary h-12 text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Нэвтэрч байна...
                  </>
                ) : (
                  'Нэвтрэх'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="card-corporate">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-center">
              Демо эрхүүд
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => quickLogin(account.email, account.password)}
                disabled={isSubmitting}
              >
                <div className="flex-1 text-left">
                  <div className="font-medium">{account.name}</div>
                  <div className="text-muted-foreground">
                    {account.email} / {account.password}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 Таван Богд Групп. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p className="mt-1">Тусламж хэрэгтэй бол IT хэлтэстэй холбогдоно уу</p>
        </div>
      </div>
    </div>
  );
};

export default Login;