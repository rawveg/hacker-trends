import React from 'react';
import MobileSidebar from './MobileSidebar';
import { BotMessageSquare } from 'lucide-react';

const Header = () => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <BotMessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Hacker Trends</h2>
      </div>
      <MobileSidebar />
    </header>
  );
};

export default Header;