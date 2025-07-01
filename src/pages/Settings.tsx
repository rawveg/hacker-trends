import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { settings, setSettings } = useSettings();

  const handleSpeedChange = (value: number[]) => {
    setSettings({ ...settings, tickerSpeed: value[0] });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Settings</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application. Select your preferred theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="font-medium text-muted-foreground">Theme</p>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("system")}
              >
                <Laptop className="mr-2 h-4 w-4" />
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Configure the behavior of dashboard widgets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="ticker-speed">Live Ticker Speed</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="ticker-speed"
                min={100}
                max={800}
                step={50}
                value={[settings.tickerSpeed]}
                onValueChange={handleSpeedChange}
                className="w-[60%]"
              />
              <span className="text-sm font-medium text-muted-foreground w-28">
                {settings.tickerSpeed}s duration
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;