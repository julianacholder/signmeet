// app/company/layout.tsx
import TopNavBar from '@/app/components/layout/TopNavBar';
import CompanySidebar from '@/app/components/layout/CompanySidebar';

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <CompanySidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar userName="TechCorp Ltd" userInitials="TC" />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}