import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, BarChart, Rss, Settings, BotMessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: BarChart },
    { href: '/deep-dive', label: 'Story Deep-Dive', icon: Rss },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-background p-6">
        <div className="flex items-center gap-3 mb-10">
          <BotMessageSquare className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Hacker Trends</h2>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="mb-4">
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium text-lg',
                    pathname === item.href && 'bg-primary/20 text-primary'
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;