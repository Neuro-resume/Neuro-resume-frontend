import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResumePreview } from '@/components/ResumePreview';

export function PreviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <ResumePreview sessionId={sessionId || undefined} onGoHome={handleGoHome} />
  );
}
