import { ThemeSelector } from "@/components/ui/theme-selector";

export default function ThemeSelectorPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold">Theme Selector</h1>
          <p className="text-muted-foreground">
            Choose your preferred theme for the application
          </p>
        </div>
        
        <div className="flex justify-center">
          <ThemeSelector />
        </div>
      </div>
    </div>
  );
}