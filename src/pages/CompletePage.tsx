import { useNavigate, useSearchParams } from 'react-router-dom';
import { CompletionScreen } from '@/components/CompletionScreen';

export function CompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <CompletionScreen
      sessionId={sessionId || undefined}
      onRestart={handleRestart}
    />
  );
}
