import { useState } from 'react';
import { User, TrendingUp, Target, Star, Calendar, LogOut, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import MobileLayout from '@/components/MobileLayout';

interface KPI {
  name: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const UserProfile = () => {
  const [user] = useState({
    name: 'Батбаяр',
    position: 'Ахлах програмист',
    department: 'IT хэлтэс',
    employeeId: 'TB001',
    email: 'batbayar@tavanbogd.mn',
    joinDate: '2022-03-15',
    avatar: '👨‍💻'
  });

  const [kpis] = useState<KPI[]>([
    {
      name: 'Ирц',
      current: 94,
      target: 95,
      trend: 'up',
      color: 'text-success'
    },
    {
      name: 'Төслийн дуусгалт',
      current: 88,
      target: 90,
      trend: 'up', 
      color: 'text-primary'
    },
    {
      name: 'Багийн хамтын ажиллагаа',
      current: 92,
      target: 85,
      trend: 'stable',
      color: 'text-accent'
    },
    {
      name: 'Ажлын үр дүн',
      current: 96,
      target: 90,
      trend: 'up',
      color: 'text-warning'
    }
  ]);

  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Өглөөний хурал',
      description: 'Маргаашийн багийн хурал 10:00 цагт. Өчигдрийн ахиц дэвшлээ бэлтгэнэ үү.',
      priority: 'high',
      category: 'Хурал'
    },
    {
      id: '2', 
      title: 'Кодын хянах',
      description: 'React компонентийн кодыг хянаж, сэтгэгдэл үлдээнэ үү.',
      priority: 'medium',
      category: 'Ажил'
    },
    {
      id: '3',
      title: 'Ур чадвар хөгжүүлэх',
      description: 'TypeScript-ийн сургалтад бүртгүүлэх хугацаа дуусч байна.',
      priority: 'low',
      category: 'Хөгжил'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-destructive text-destructive-foreground',
      medium: 'bg-warning text-warning-foreground', 
      low: 'bg-success text-success-foreground'
    };
    return colors[priority as keyof typeof colors];
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'Яаралтай',
      medium: 'Дунд зэрэг',
      low: 'Бага'
    };
    return labels[priority as keyof typeof labels];
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  };

  const calculateOverallScore = () => {
    const total = kpis.reduce((acc, kpi) => acc + (kpi.current / kpi.target) * 100, 0);
    return Math.round(total / kpis.length);
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="card-corporate">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.position}</p>
                <p className="text-sm text-muted-foreground">{user.department}</p>
                
                <div className="flex items-center mt-2 space-x-4 text-xs text-muted-foreground">
                  <span>ID: {user.employeeId}</span>
                  <span>Элссэн: {new Date(user.joinDate).toLocaleDateString('mn-MN')}</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {calculateOverallScore()}%
                </div>
                <div className="text-xs text-muted-foreground">Нийт дүн</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Dashboard */}
        <Card className="card-corporate">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Гүйцэтгэлийн үзүүлэлт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{kpi.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${kpi.color}`}>
                      {kpi.current}%
                    </span>
                    <span className="text-muted-foreground">/ {kpi.target}%</span>
                    <span>{getTrendIcon(kpi.trend)}</span>
                  </div>
                </div>
                <Progress 
                  value={(kpi.current / kpi.target) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Work Recommendations */}
        <Card className="card-corporate">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-accent" />
              Ажлын зөвлөмж
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-3 bg-muted/20 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                  <Badge className={`${getPriorityColor(rec.priority)} text-xs`}>
                    {getPriorityLabel(rec.priority)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                <div className="text-xs text-muted-foreground">
                  Ангилал: {rec.category}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 flex-col space-y-1">
            <Settings className="h-5 w-5" />
            <span className="text-xs">Тохиргоо</span>
          </Button>
          <Button variant="outline" className="h-12 flex-col space-y-1 text-destructive hover:text-destructive">
            <LogOut className="h-5 w-5" />
            <span className="text-xs">Гарах</span>
          </Button>
        </div>

        {/* Achievement Section */}
        <Card className="card-corporate">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-warning" />
              Сүүлийн амжилт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
              <div className="text-2xl">🏆</div>
              <div>
                <h4 className="font-medium text-foreground">Сарын шилдэг програмист</h4>
                <p className="text-sm text-muted-foreground">Гэгээн сарын 1-нд</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl">💻</div>
              <div>
                <h4 className="font-medium text-foreground">Төслийг хугацаандаа дууссан</h4>
                <p className="text-sm text-muted-foreground">Арван сарын 28-нд</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
              <div className="text-2xl">👥</div>
              <div>
                <h4 className="font-medium text-foreground">Багийн тэргүүлэгч</h4>
                <p className="text-sm text-muted-foreground">Есөн сарын 15-нд</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default UserProfile;