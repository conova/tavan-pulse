import { useState, useEffect } from 'react';
import { Users, Clock, MapPin, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/MobileLayout';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  status: 'checked-in' | 'checked-out' | 'late' | 'absent';
  checkInTime?: string;
  location: string;
  workingHours: number;
  avatar: string;
}

const TeamDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Батбаяр',
      department: 'IT хэлтэс',
      position: 'Програмист',
      status: 'checked-in',
      checkInTime: '09:00',
      location: 'Төв оффис',
      workingHours: 6.5,
      avatar: '👨‍💻'
    },
    {
      id: '2', 
      name: 'Сарангэрэл',
      department: 'Хүний нөөц',
      position: 'HR менежер',
      status: 'checked-in',
      checkInTime: '08:45',
      location: 'Төв оффис',
      workingHours: 7.2,
      avatar: '👩‍💼'
    },
    {
      id: '3',
      name: 'Энхбаяр',
      department: 'Санхүү',
      position: 'Нягтлан бодогч',
      status: 'late',
      checkInTime: '09:30',
      location: 'Төв оффис',
      workingHours: 5.8,
      avatar: '👨‍💼'
    },
    {
      id: '4',
      name: 'Оюунбилэг',
      department: 'Маркетинг',
      position: 'Дизайнер',
      status: 'checked-out',
      checkInTime: '09:15',
      location: 'Гэрээс ажиллах',
      workingHours: 8.0,
      avatar: '👩‍🎨'
    },
    {
      id: '5',
      name: 'Батболд',
      department: 'Борлуулалт',
      position: 'Борлуулалтын менежер',
      status: 'absent',
      location: 'Амралт',
      workingHours: 0,
      avatar: '👨‍💻'
    }
  ]);

  const getStatusBadge = (status: Employee['status']) => {
    const statusConfig = {
      'checked-in': { label: 'Ажилд байна', variant: 'default' as const, color: 'status-success' },
      'checked-out': { label: 'Гарсан', variant: 'secondary' as const, color: 'bg-muted' },
      'late': { label: 'Хоцорсон', variant: 'destructive' as const, color: 'status-warning' },
      'absent': { label: 'Байхгүй', variant: 'outline' as const, color: 'status-error' }
    };
    return statusConfig[status];
  };

  const stats = {
    total: employees.length,
    present: employees.filter(e => e.status === 'checked-in').length,
    late: employees.filter(e => e.status === 'late').length,
    absent: employees.filter(e => e.status === 'absent').length,
    avgHours: employees.reduce((acc, e) => acc + e.workingHours, 0) / employees.length
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Багийн хянах самбар</h1>
          <p className="text-muted-foreground">{formatDate(selectedDate)}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="card-corporate">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.present}</div>
              <div className="text-sm text-muted-foreground">Ажилд байгаа</div>
            </CardContent>
          </Card>
          <Card className="card-corporate">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Нийт ажилтан</div>
            </CardContent>
          </Card>
          <Card className="card-corporate">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{stats.late}</div>
              <div className="text-sm text-muted-foreground">Хоцорсон</div>
            </CardContent>
          </Card>
          <Card className="card-corporate">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{stats.avgHours.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Дундаж цаг</div>
            </CardContent>
          </Card>
        </div>

        {/* Team List */}
        <Card className="card-corporate">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Багийн гишүүд
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employees.map((employee) => {
              const statusInfo = getStatusBadge(employee.status);
              return (
                <div key={employee.id} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg">
                        {employee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {employee.status === 'checked-in' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background pulse-primary"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground truncate">{employee.name}</h3>
                      <Badge variant={statusInfo.variant} className={`${statusInfo.color} text-xs`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                    
                    <div className="flex items-center mt-2 space-x-4 text-xs text-muted-foreground">
                      {employee.checkInTime && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {employee.checkInTime}
                        </div>
                      )}
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {employee.location}
                      </div>
                      {employee.workingHours > 0 && (
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {employee.workingHours}ц
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Date Navigation */}
        <Card className="card-corporate">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
              >
                ← Өчигдөр
              </Button>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Өнөөдөр</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                disabled={selectedDate >= new Date()}
              >
                Маргааш →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default TeamDashboard;