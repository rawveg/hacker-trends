import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import StoryDeepDive from "./pages/StoryDeepDive";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./components/ThemeProvider";
import { SettingsProvider } from "./contexts/SettingsContext";
import KeywordDeepDive from "./pages/KeywordDeepDive";
import StoryPage from "./pages/StoryPage";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import ActivityDeepDive from "./pages/ActivityDeepDive";
import SentimentDeepDive from "./pages/SentimentDeepDive";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/deep-dive" element={<MainLayout><StoryDeepDive /></MainLayout>} />
              <Route path="/keyword/:keyword" element={<MainLayout><KeywordDeepDive /></MainLayout>} />
              <Route path="/story/:storyId" element={<MainLayout><StoryPage /></MainLayout>} />
              <Route path="/sentiment/:timestamp" element={<MainLayout><SentimentAnalysis /></MainLayout>} />
              <Route path="/sentiment-deep-dive/:category" element={<MainLayout><SentimentDeepDive /></MainLayout>} />
              <Route path="/activity/:timestamp" element={<MainLayout><ActivityDeepDive /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;