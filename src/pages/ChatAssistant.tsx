import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MobileLayout from '@/components/MobileLayout';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Сайн байна уу! Би Таван Богд групын AI туслах. Та надаас ажлын цаг, тайлан, бодлого болон бусад асуултуудаа асууж болно. Танд хэрхэн туслах вэ?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI response logic - simulated intelligent responses
  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Time-related queries
    if (message.includes('цаг') || message.includes('ажлын цаг')) {
      return 'Таны ажлын цагийн талаар мэдээлэл: Стандарт ажлын цаг 09:00-18:00 байна. Өдөрт 8 цаг, долоо хоногт 40 цаг ажиллах ёстой. Хэрэв цагийн бүртгэлд асуудал байвал "Хүсэлт" хэсгээс шинэ хүсэлт үүсгэнэ үү.';
    }
    
    if (message.includes('хоцорсон') || message.includes('оройтсон')) {
      return 'Хэрэв та ажилд хоцорсон бол дараах алхмуудыг дагана уу:\n1. Менежертээ мэдэгдэнэ үү\n2. "Хүсэлт" хэсгээс тайлбар оруулна уу\n3. Дараа дахин хоцрохгүйн тулд өглөөний горимоо шинэчилнэ үү';
    }

    // Leave and absence queries  
    if (message.includes('амралт') || message.includes('чөлөө')) {
      return 'Амралт авахын тулд:\n1. Өмнөх 3 хоногоор хүсэлт гаргана уу\n2. HR хэлтэст батлуулна уу\n3. Ажлаа орлон гүйцэтгэх хүнтэй зөвшилцөнө үү\n\nЖилийн амралт: 15 хоног\nЭмнэлгийн амралт: Эмчийн тодорхойлгоогоор';
    }

    // Performance and KPI queries
    if (message.includes('гүйцэтгэл') || message.includes('үнэлгээ')) {
      return 'Таны гүйцэтгэлийн үнэлгээ профайл хэсэгт байна. Үндсэн үзүүлэлтүүд:\n• Ирц: Сарын 95%-аас дээш\n• Төслийн дуусгалт: Хугацаандаа\n• Багтай хамтын ажиллагаа: Идэвхтэй оролцоо\n\nСарын эцэст дэлгэрэнгүй тайлан гарна.';
    }

    // Company policy queries
    if (message.includes('бодлого') || message.includes('дүрэм')) {
      return 'Компанийн үндсэн бодлогууд:\n• Ажлын цаг: 09:00-18:00\n• Ажлын өдөр: Даваа-Баасан\n• Амралтын өдөр: Бямба, Ням\n• Хувцаслалт: Албан ёсны хувцас\n• Гар утас: Ажлын цагт хязгаарлагдмал хэрэглээ';
    }

    // Meeting and schedule queries
    if (message.includes('хурал') || message.includes('уулзалт')) {
      return 'Хурлын хуваарь:\n• Багийн хурал: Даваа 10:00\n• Төслийн хурал: Лхагва 14:00\n• Сарын тайлан: Сарын эцэс\n\nХурлын өрөө захиалга: admin@tavanbogd.mn руу имэйл илгээнэ үү.';
    }

    // Task and project management
    if (message.includes('ажил') || message.includes('төсөл')) {
      return 'Ажлын зөвлөмж:\n• Эрхэм зэрэглэл тогтооно уу\n• Хугацаа тогтооно уу\n• Ахиц дэвшлийг тогтмол шалгана уу\n• Багтайгаа харилцана уу\n• Туслага хэрэгтэй бол дараалж асууна уу';
    }

    // Default helpful response
    const responses = [
      'Би танд тусалж чадна. Илүү тодорхой асуулт асууна уу.',
      'Таны асуултын талаар дэлгэрэнгүй мэдээлэл авахын тулд HR хэлтэстэй холбогдоно уу.',
      'Энэ талаар компанийн бодлогод дэлгэрэнгүй заасан байгаа. Танд имэйлээр илгээж болох уу?',
      'Сонирхолтой асуулт! Энэ талаар менежертэйгээ ярилцахыг зөвлөж байна.',
      'Таны асуулт надад тодорхойгүй байна. Өөрөөр асууж болох уу?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const assistantResponse: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content: getAIResponse(inputMessage),
        sender: 'assistant', 
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-card/50 backdrop-blur">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-foreground">AI Туслах</h1>
              <p className="text-sm text-muted-foreground">Таван Богд Групп</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <Card className={`${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'card-corporate'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString('mn-MN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="card-corporate">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Бичиж байна...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Асуултаа бичнэ үү..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="btn-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ChatAssistant;