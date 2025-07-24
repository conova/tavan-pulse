import { useState } from 'react';
import { Shield, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const DeviceVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { verifyOtp, isLoading, pendingUser } = useAuth();
  const { toast } = useToast();

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('OTP код 6 оронтой байх ёстой');
      return;
    }

    setError('');
    const success = await verifyOtp(otp);
    
    if (success) {
      toast({
        title: 'Төхөөрөмж баталгаажлаа',
        description: 'Та амжилттай нэвтэрлээ',
      });
    } else {
      setError('Буруу OTP код. Дахин оролдоно уу.');
      setOtp('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mb-4 shadow-glow">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary-dark">
            Төхөөрөмж баталгаажуулах
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Шинэ төхөөрөмж илрүүллээ. Та HR-аас авсан OTP кодоо оруулна уу.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="bg-muted/50 rounded-lg p-4 flex items-center space-x-3">
            <div className="text-2xl">{pendingUser?.avatar}</div>
            <div>
              <p className="font-medium">{pendingUser?.name}</p>
              <p className="text-sm text-muted-foreground">{pendingUser?.position}</p>
            </div>
          </div>

          {/* Instructions */}
          <Alert className="border-blue-200 bg-blue-50">
            <Smartphone className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Шинэ төхөөрөмж:</strong> Энэ төхөөрөмжийг анх удаа ашиглаж байна. HR-аас авсан 6 оронтой OTP кодыг оруулна уу.
            </AlertDescription>
          </Alert>

          {/* OTP Input */}
          <div className="space-y-4">
            <div className="text-center">
              <label className="text-sm font-medium text-foreground block mb-3">
                OTP код оруулах
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError('');
                  }}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Demo OTP Codes */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-800 mb-2">Demo OTP кодууд:</p>
            <div className="space-y-1 text-xs text-amber-700">
              <p><strong>123456</strong> - Батбаяр/Admin</p>
              <p><strong>789012</strong> - Сарангэрэл</p>
              <p><strong>345678</strong> - Энхбаяр</p>
            </div>
          </div>

          {/* Verify Button */}
          <Button 
            onClick={handleVerifyOtp} 
            disabled={otp.length !== 6 || isLoading}
            className="w-full h-12 bg-gradient-accent hover:opacity-90 shadow-glow transition-all"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Шалгаж байна...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Баталгаажуулах</span>
              </div>
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              OTP код байхгүй юу? HR хэлтэстэй холбогдоно уу.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Холбоо барих:</strong> hr@tavanbogd.mn | +976 7777-8888
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};