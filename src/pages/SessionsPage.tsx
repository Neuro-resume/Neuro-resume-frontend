import { useNavigate } from 'react-router-dom';
import { SessionsScreen } from '@/components/SessionsScreen';

export function SessionsPage() {
  const navigate = useNavigate();

  const handleContinueSession = (sessionId: string) => {
    navigate(`/interview?sessionId=${sessionId}`);
  };

  const handleStartNewInterview = () => {
    navigate('/interview');
  };

  return (
    <SessionsScreen
      onContinueSession={handleContinueSession}
      onStartNewInterview={handleStartNewInterview}
    />
  );
}
