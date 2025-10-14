import { useNavigate, useSearchParams } from 'react-router-dom';
import { CompletionScreen } from '@/components/CompletionScreen';

export function CompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const handleRestart = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/sessions');
  };

  const handleViewPreview = () => {
    if (sessionId) {
      navigate(`/preview?sessionId=${sessionId}`);
    }
  };

  return (
    <CompletionScreen
      sessionId={sessionId || undefined}
      onRestart={handleRestart}
      onBack={handleBack}
      onViewPreview={handleViewPreview}
    />
  );
}
