
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Search,
  FileText,
  LayoutTemplate,
  Files,
  Wand2,
  UserRound,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  isCollapsed: boolean;
}

const NavItem = ({ icon: Icon, label, onClick, isCollapsed }: NavItemProps) => (
  <Button
    variant="ghost"
    className={cn(
      "w-full justify-start gap-4 px-4",
      isCollapsed && "justify-center px-2"
    )}
    onClick={onClick}
  >
    <Icon className="h-5 w-5" />
    {!isCollapsed && <span>{label}</span>}
  </Button>
);

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative">
      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between mb-2">
            {!isCollapsed && <div className="font-semibold">Promptly</div>}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                isCollapsed && "mx-auto"
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <Button variant="ghost" className={cn(
            "justify-start gap-4",
            isCollapsed && "justify-center"
          )}>
            <Search className="h-5 w-5" />
            {!isCollapsed && <span>Search</span>}
          </Button>

          <nav className="flex flex-col gap-2">
            <NavItem
              icon={FileText}
              label="Prompts"
              onClick={() => navigate('/')}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={LayoutTemplate}
              label="Templates"
              onClick={() => navigate('/templates')}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={Files}
              label="Documents"
              onClick={() => navigate('/documents')}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={Wand2}
              label="AI Tools"
              onClick={() => navigate('/ai-tools')}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={UserRound}
              label="Profile"
              onClick={() => navigate('/profile')}
              isCollapsed={isCollapsed}
            />
          </nav>

          <div className="mt-auto">
            <NavItem
              icon={LogOut}
              label="Sign Out"
              onClick={signOut}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
