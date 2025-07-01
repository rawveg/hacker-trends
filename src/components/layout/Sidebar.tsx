import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Rss, Settings, BotMessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: BarChart },
    { href: '/deep-dive', label: 'Story Deep-Dive', icon: Rss },
  ];

  return (
    <aside className="w-64 bg-white/40 dark:bg-black/20 backdrop-blur-xl border-r border-black/5 dark:border-white/10 p-6 hidden md:flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <BotMessageSquare className="h-8 w-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Hacker Trends</h2>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-4">
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium',
                  pathname === item.href && 'bg-primary/10 dark:bg-primary/20 text-primary font-semibold'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <Link
          to="/settings"
          className={cn(
            'flex items-center gap-3 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
            pathname === '/settings' && 'bg-primary/10 dark:bg-primary/20 text-primary font-semibold'
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;