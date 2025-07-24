import { useState } from 'react';
import { Plus, Clock, Edit, CheckCircle, XCircle, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MobileLayout from '@/components/MobileLayout';

interface Request {
  id: string;
  type: 'missing-checkin' | 'missing-checkout' | 'time-correction' | 'overtime';
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

const RequestManager = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      type: 'missing-checkin',
      date: '2024-01-20',
      description: 'Картаа мартаж орох цагаа бүртгүүлж чадаагүй',
      status: 'pending',
      submittedAt: new Date('2024-01-20T10:30:00')
    },
    {
      id: '2', 
      type: 'overtime',
      date: '2024-01-19',
      description: 'Төслийн ажлыг дуусгахын тулд илүү цаг ажилласан',
      status: 'approved',
      submittedAt: new Date('2024-01-19T18:00:00')
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: '',
    date: '',
    description: ''
  });
  
  const { toast } = useToast();

  const requestTypes = {
    'missing-checkin': { label: 'Орох цаг алдагдсан', icon: Clock, color: 'status-warning' },
    'missing-checkout': { label: 'Гарах цаг алдагдсан', icon: Clock, color: 'status-warning' },
    'time-correction': { label: 'Цаг засварлах', icon: Edit, color: 'bg-blue-500' },
    'overtime': { label: 'Илүү цагийн ажил', icon: Plus, color: 'status-success' }
  };

  const getStatusBadge = (status: Request['status']) => {
    const statusConfig = {
      pending: { label: 'Хүлээгдэж байна', variant: 'secondary' as const, color: 'bg-yellow-500' },
      approved: { label: 'Зөвшөөрсөн', variant: 'default' as const, color: 'status-success' },
      rejected: { label: 'Татгалзсан', variant: 'destructive' as const, color: 'status-error' }
    };
    return statusConfig[status];
  };

  const handleSubmitRequest = () => {
    if (!newRequest.type || !newRequest.date || !newRequest.description) {
      toast({
        title: 'Алдаа',
        description: 'Бүх талбарыг бөглөнө үү',
        variant: 'destructive'
      });
      return;
    }

    const request: Request = {
      id: Math.random().toString(36).substr(2, 9),
      type: newRequest.type as any,
      date: newRequest.date,
      description: newRequest.description,
      status: 'pending',
      submittedAt: new Date()
    };

    setRequests([request, ...requests]);
    setNewRequest({ type: '', date: '', description: '' });
    setIsDialogOpen(false);

    toast({
      title: 'Амжилттай илгээлээ',
      description: 'Таны хүсэлт хянагдах болно'
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Хүсэлтүүд</h1>
            <p className="text-muted-foreground">Цагийн бүртгэлийн хүсэлт</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Шинэ
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Шинэ хүсэлт үүсгэх</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Хүсэлтийн төрөл</Label>
                  <Select value={newRequest.type} onValueChange={(value) => setNewRequest({...newRequest, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Төрлөө сонгоно уу" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(requestTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Огноо</Label>
                  <input
                    type="date"
                    value={newRequest.date}
                    onChange={(e) => setNewRequest({...newRequest, date: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Тайлбар</Label>
                  <Textarea
                    placeholder="Хүсэлтийн дэлгэрэнгүй тайлбар..."
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Цуцлах
                  </Button>
                  <Button onClick={handleSubmitRequest} className="btn-primary flex-1">
                    Илгээх
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="card-corporate">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-warning">
                {requests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-xs text-muted-foreground">Хүлээгдэж байна</div>
            </CardContent>
          </Card>
          <Card className="card-corporate">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-success">
                {requests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-xs text-muted-foreground">Зөвшөөрсөн</div>
            </CardContent>
          </Card>
          <Card className="card-corporate">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-destructive">
                {requests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-xs text-muted-foreground">Татгалзсан</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card className="card-corporate">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">Хүсэлт байхгүй</h3>
                <p className="text-muted-foreground text-sm">
                  Та шинэ хүсэлт үүсгэж эхэлнэ үү
                </p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => {
              const typeInfo = requestTypes[request.type];
              const statusInfo = getStatusBadge(request.status);
              const TypeIcon = typeInfo.icon;
              
              return (
                <Card key={request.id} className="card-corporate">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                          <TypeIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{typeInfo.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(request.date)}
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant={statusInfo.variant} className={`${statusInfo.color} text-xs`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {request.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Илгээсэн: {request.submittedAt.toLocaleDateString('mn-MN')}
                      </div>
                      
                      {request.status === 'approved' && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                      {request.status === 'rejected' && (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default RequestManager;