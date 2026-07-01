import { useApp } from '@/context/AppContext';
import { setOnboardingCompleted } from '@/services/storage';

import { ChatbotDrawer } from './ChatbotDrawer';
import { DailyDigestStories } from './DailyDigestStories';
import { OnboardingOverlay } from './OnboardingOverlay';
import { Toast } from './Toast';

export function AppOverlays() {
  const {
    isGuest,
    showOnboarding,
    setShowOnboarding,
    showDigestStories,
    setShowDigestStories,
    showChatbot,
    closeChatbot,
    chatbotContext,
    toastMessage,
    toastType,
    showToast,
    hideToast,
  } = useApp();

  const isProjectContext = chatbotContext !== 'projeto de lei';

  const handleOnboardingDone = async () => {
    await setOnboardingCompleted(true);
    setShowOnboarding(false);
  };

  return (
    <>
      <OnboardingOverlay
        isVisible={showOnboarding}
        onComplete={handleOnboardingDone}
        onSkip={handleOnboardingDone}
      />
      <DailyDigestStories
        isOpen={showDigestStories}
        onClose={() => setShowDigestStories(false)}
      />
      {!isGuest && (
        <ChatbotDrawer
          isOpen={showChatbot}
          onClose={closeChatbot}
          context={chatbotContext}
          projectTitle={isProjectContext ? chatbotContext : undefined}
        />
      )}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        type={toastType}
        onClose={hideToast}
      />
    </>
  );
}