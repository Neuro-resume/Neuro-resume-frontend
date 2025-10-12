import { useNavigate } from 'react-router-dom';
import { SettingsScreen } from '@/components/SettingsScreen';

export function ProfilePage() {
  const navigate = useNavigate();

  const handleNavigateToSessions = () => {
    navigate('/sessions');
  };

  return <SettingsScreen onNavigateToSessions={handleNavigateToSessions} />;
}
