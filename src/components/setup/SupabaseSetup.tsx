
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function SupabaseSetup() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleSaveConfig = () => {
    setIsConfiguring(true);
    
    // In a real app, you would save these values to a secure storage
    // For now, we'll just alert the user
    alert('Please add these values to your environment variables:\n\n' + 
          'VITE_SUPABASE_URL=' + supabaseUrl + '\n' +
          'VITE_SUPABASE_ANON_KEY=' + supabaseKey);
    
    setIsConfiguring(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Configuration</CardTitle>
        <CardDescription>
          Enter your Supabase project details to connect your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supabase-url">Supabase URL</Label>
          <Input 
            id="supabase-url" 
            placeholder="https://your-project.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supabase-key">Supabase Anon Key</Label>
          <Input 
            id="supabase-key" 
            placeholder="your-anon-key"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This is your public anon key, not your service role key
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveConfig} 
          disabled={!supabaseUrl || !supabaseKey || isConfiguring}
          className="w-full"
        >
          {isConfiguring ? "Saving..." : "Save Configuration"}
        </Button>
      </CardFooter>
    </Card>
  );
}
