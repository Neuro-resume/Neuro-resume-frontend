import { useNavigate } from 'react-router-dom';
import { StartScreen as StartScreenComponent } from '@/components/StartScreen';

export function StartPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/interview');
  };

  const handleShowProfile = () => {
    navigate('/profile');
  };

  return (
    <StartScreenComponent
      onStart={handleStart}
      onShowProfile={handleShowProfile}
    />
  );
}
