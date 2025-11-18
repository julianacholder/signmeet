import TopNavBar from '@/app/components/layout/TopNavBar';
import CandidateSidebar from '@/app/components/layout/CandidateSidebar';

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background"> 
      <CandidateSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar userName="Juliana" userInitials="JU" />
        
        <main className="flex-1 overflow-auto bg-white dark:bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}