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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tavanbogd_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('tavanbogd_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tavanbogd_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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