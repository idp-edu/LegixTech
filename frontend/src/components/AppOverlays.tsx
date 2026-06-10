import { useApp } from '@/context/AppContext';

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
    showToast,
    hideToast,
  } = useApp();

  const isProjectContext = chatbotContext !== 'projeto de lei';

  return (
    <>
      <OnboardingOverlay
        isVisible={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
      />
      <DailyDigestStories
        isOpen={showDigestStories}
        onClose={() => setShowDigestStories(false)}
        onViewProjects={() => setShowDigestStories(false)}
      />
      {!isGuest && (
        <ChatbotDrawer
          isOpen={showChatbot}
          onClose={closeChatbot}
          context={chatbotContext}
          projectTitle={isProjectContext ? chatbotContext : undefined}
        />
      )}
      <Toast message={toastMessage} isVisible={showToast} onClose={hideToast} />
    </>
  );
}