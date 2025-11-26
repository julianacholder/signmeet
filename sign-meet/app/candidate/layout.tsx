import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import TopNavBar from '@/app/components/layout/TopNavBar';
import CandidateSidebar from '@/app/components/layout/CandidateSidebar';

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex h-screen bg-gray-50 dark:bg-background">
        <CandidateSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavBar userName="Juliana" userInitials="JU" />
          
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-background">
            {children}
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}