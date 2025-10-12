import { useState } from 'react';
import { StartScreen } from '@/components/StartScreen';
import { InterviewSession } from '@/components/InterviewSession';
import { CompletionScreen } from '@/components/CompletionScreen';
import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/contexts/useAuth';

type AppState = 'start' | 'interview' | 'complete';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export default function App() {
  const { isAuthenticated, login } = useAuth();
  const [appState, setAppState] = useState<AppState>('start');
  const [_sessionData, setSessionData] = useState<Message[]>([]);

  // Если не авторизован, показываем экран входа
  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  const handleStartSession = () => {
    setAppState('interview');
  };

  const handleCompleteSession = (messages: Message[]) => {
    setSessionData(messages);
    setAppState('complete');
  };

  const handleCancelSession = () => {
    if (
      confirm(
        'Вы уверены, что хотите завершить сеанс досрочно? Прогресс будет потерян.'
      )
    ) {
      setAppState('start');
      setSessionData([]);
    }
  };

  const handleRestart = () => {
    setAppState('start');
    setSessionData([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {appState === 'start' && <StartScreen onStart={handleStartSession} />}
      {appState === 'interview' && (
        <InterviewSession
          onComplete={handleCompleteSession}
          onCancel={handleCancelSession}
        />
      )}
      {appState === 'complete' && (
        <CompletionScreen onRestart={handleRestart} />
      )}
    </div>
  );
}
