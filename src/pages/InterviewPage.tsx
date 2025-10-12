import { useNavigate, useSearchParams } from 'react-router-dom';
import { InterviewSession } from '@/components/InterviewSession';

export function InterviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const handleComplete = () => {
    navigate(`/complete${sessionId ? `?sessionId=${sessionId}` : ''}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <InterviewSession onComplete={handleComplete} onCancel={handleCancel} />
  );
}
