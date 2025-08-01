import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  avatar: string;
  employeeId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; needsOtp?: boolean }>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  pendingUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Батбаяр',
    email: 'batbayar@tavanbogd.mn',
    password: '123456',
    position: 'Ахлах програмист',
    department: 'IT хэлтэс',
    avatar: '👨‍💻',
    employeeId: 'TB001'
  },
  {
    id: '2',
    name: 'Сарангэрэл',
    email: 'sarangerel@tavanbogd.mn',
    password: '123456',
    position: 'HR менежер',
    department: 'Хүний нөөц',
    avatar: '👩‍💼',
    employeeId: 'TB002'
  },
  {
    id: '3',
    name: 'Энхбаяр',
    email: 'enhbayar@tavanbogd.mn',
    password: '123456',
    position: 'Нягтлан бодогч',
    department: 'Санхүү',
    avatar: '👨‍💼',
    employeeId: 'TB003'
  },
  {
    id: '4',
    name: 'admin',
    email: 'admin@tavanbogd.mn',
    password: 'admin',
    position: 'Системийн админ',
    department: 'IT хэлтэс',
    avatar: '👨‍💻',
    employeeId: 'TB000'
  }
];

// Generate device fingerprint
const getDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Device fingerprint', 2, 2);
  
  return btoa(
    navigator.userAgent +
    navigator.language +
    screen.width + screen.height +
    new Date().getTimezoneOffset() +
    canvas.toDataURL()
  ).slice(0, 32);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tavanbogd_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; needsOtp?: boolean }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Check if device is known
      const deviceFingerprint = getDeviceFingerprint();
      const savedDevices = JSON.parse(localStorage.getItem(`devices_${foundUser.id}`) || '[]');
      
      if (!savedDevices.includes(deviceFingerprint)) {
        // New device detected - require OTP verification
        setPendingUser(userWithoutPassword);
        setIsLoading(false);
        return { success: true, needsOtp: true };
      }
      
      // Known device - login directly
      setUser(userWithoutPassword);
      localStorage.setItem('tavanbogd_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false };
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (!pendingUser) return false;
    
    setIsLoading(true);
    
    // Simulate API verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock OTP verification - in real app, this would verify against server
    const validOtps = ['123456', '789012', '345678']; // Demo OTPs
    
    if (validOtps.includes(otp)) {
      // Save device fingerprint
      const deviceFingerprint = getDeviceFingerprint();
      const savedDevices = JSON.parse(localStorage.getItem(`devices_${pendingUser.id}`) || '[]');
      savedDevices.push(deviceFingerprint);
      localStorage.setItem(`devices_${pendingUser.id}`, JSON.stringify(savedDevices));
      
      // Complete login
      setUser(pendingUser);
      localStorage.setItem('tavanbogd_user', JSON.stringify(pendingUser));
      setPendingUser(null);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setPendingUser(null);
    localStorage.removeItem('tavanbogd_user');
  };

  return (
    <AuthContext.Provider value={{ user, pendingUser, login, verifyOtp, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};