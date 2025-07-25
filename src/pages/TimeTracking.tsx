import { useState, useEffect } from 'react';
import { Clock, MapPin, Play, Square, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import MobileLayout from '@/components/MobileLayout';

interface TimeEntry {
  id: string;
  type: 'check-in' | 'check-out';
  timestamp: Date;
  location: string;
  coordinates?: { lat: number; lng: number };
}

interface WorkingDay {
  date: string;
  entries: TimeEntry[];
  totalHours: number;
  status: 'complete' | 'incomplete' | 'ongoing';
}

const TimeTracking = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Байршил олж байна...');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workingDay, setWorkingDay] = useState<WorkingDay>({
    date: new Date().toISOString().split('T')[0],
    entries: [],
    totalHours: 0,
    status: 'incomplete'
  });
  const { toast } = useToast();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setCurrentLocation('Улаанбаатар, Монгол');
        }
      );
    }
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('timeTracking');
    if (saved) {
      const data = JSON.parse(saved);
      setWorkingDay(data);
      setIsCheckedIn(data.status === 'ongoing');
    }
  }, []);

  const handleTimeAction = () => {
    const now = new Date();
    const newEntry: TimeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type: isCheckedIn ? 'check-out' : 'check-in',
      timestamp: now,
      location: currentLocation,
    };

    const updatedDay = {
      ...workingDay,
      entries: [...workingDay.entries, newEntry],
    };

    // Calculate total hours if checking out
    if (isCheckedIn && workingDay.entries.length > 0) {
      const lastCheckIn = workingDay.entries
        .filter(e => e.type === 'check-in')
        .pop();
      
      if (lastCheckIn) {
        const hours = (now.getTime() - new Date(lastCheckIn.timestamp).getTime()) / (1000 * 60 * 60);
        updatedDay.totalHours = workingDay.totalHours + hours;
        updatedDay.status = 'complete';
      }
    } else if (!isCheckedIn) {
      updatedDay.status = 'ongoing';
    }

    setWorkingDay(updatedDay);
    setIsCheckedIn(!isCheckedIn);
    localStorage.setItem('timeTracking', JSON.stringify(updatedDay));

    toast({
      title: isCheckedIn ? 'Амжилттай гарлаа' : 'Амжилттай орлоо',
      description: `${now.toLocaleTimeString('mn-MN')} цагт ${currentLocation}-д`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('mn-MN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Цагийн бүртгэл</h1>
          <p className="text-muted-foreground">{formatDate(currentTime)}</p>
        </div>

        {/* Current Time Display */}
        <Card className="card-corporate">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center justify-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{currentLocation}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <Badge 
              variant={isCheckedIn ? "default" : "secondary"} 
              className={`px-6 py-3 text-lg font-medium ${
                isCheckedIn 
                  ? 'bg-gradient-to-r from-success to-success-glow text-white shadow-[var(--shadow-success)]' 
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              {isCheckedIn ? '✓ Ажилд байна' : '○ Ажилд ороогүй'}
            </Badge>
          </div>

          {!isCheckedIn ? (
            <Button
              onClick={handleTimeAction}
              className="w-full h-16 text-lg font-semibold btn-primary hover:shadow-[var(--shadow-primary)] hover:scale-[1.02] transition-all duration-300"
            >
              <Play className="mr-3 h-6 w-6" />
              Ажилд орох
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleTimeAction}
                className="h-16 text-lg font-semibold btn-success hover:shadow-[var(--shadow-success)] hover:scale-[1.02] transition-all duration-300"
              >
                <Square className="mr-2 h-5 w-5" />
                Ажлаас гарах
              </Button>
              <Button
                variant="outline"
                className="h-16 text-lg font-semibold border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                disabled
              >
                <Clock className="mr-2 h-5 w-5" />
                Цаг тооцох
              </Button>
            </div>
          )}
        </div>

        {/* Today's Summary */}
        <Card className="card-corporate">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-success" />
              Өнөөдрийн хураангуй
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {workingDay.totalHours.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Нийт цаг</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {workingDay.entries.length}
                </div>
                <div className="text-sm text-muted-foreground">Үйлдэл</div>
              </div>
            </div>

            {/* Recent Activity */}
            {workingDay.entries.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Сүүлийн үйлдэл</h4>
                {workingDay.entries.slice(-3).reverse().map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">
                        {entry.type === 'check-in' ? 'Орлоо' : 'Гарлаа'}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString('mn-MN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default TimeTracking;