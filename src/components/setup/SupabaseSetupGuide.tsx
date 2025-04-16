
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export default function SupabaseSetupGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Supabase Setup Guide</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setting Up Supabase</DialogTitle>
          <DialogDescription>
            Follow these steps to set up your Supabase project for authentication
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Make sure you've created the following tables in your Supabase database:
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h3 className="font-medium">1. Create users_meta table</h3>
            <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
              {`CREATE TABLE users_meta (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT NOT NULL,
  role TEXT NOT NULL,
  allowed_software TEXT[] DEFAULT '{}',
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
            </pre>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">2. Create work_items table</h3>
            <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
              {`CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  software TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
            </pre>
          </div>
          
          <p className="text-sm text-muted-foreground">
            After creating these tables, make sure to set up the appropriate Row Level Security (RLS) policies for your tables.
          </p>
          
          <div className="pt-4">
            <Link to="https://supabase.com/dashboard" target="_blank">
              <Button className="w-full">Open Supabase Dashboard</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
