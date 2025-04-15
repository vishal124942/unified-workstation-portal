
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export default function DatabaseConnection() {
  const [connectionUrl, setConnectionUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  
  const handleConnect = async () => {
    if (!connectionUrl.trim()) {
      setError("Please enter a connection URL");
      return;
    }
    
    setIsConnecting(true);
    setError("");
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would establish a connection to the database
      setIsConnected(true);
      toast({
        title: "Database connected",
        description: "Successfully connected to the database.",
      });
    } catch (err) {
      setError("Failed to connect to the database. Please check your connection URL.");
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect to the database. Please check your connection URL.",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionUrl("");
    toast({
      title: "Database disconnected",
      description: "Successfully disconnected from the database.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connection</CardTitle>
        <CardDescription>
          Connect to a database to store and manage application data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">
                Connected to database: <span className="font-mono">{connectionUrl}</span>
              </p>
            </div>
            
            <Tabs defaultValue="users">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="software">Software</TabsTrigger>
                <TabsTrigger value="work">Work Items</TabsTrigger>
              </TabsList>
              <TabsContent value="users" className="p-4 border rounded-md mt-2">
                <p className="text-muted-foreground">
                  This would display user data from the connected database.
                </p>
              </TabsContent>
              <TabsContent value="software" className="p-4 border rounded-md mt-2">
                <p className="text-muted-foreground">
                  This would display software data from the connected database.
                </p>
              </TabsContent>
              <TabsContent value="work" className="p-4 border rounded-md mt-2">
                <p className="text-muted-foreground">
                  This would display work items from the connected database.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connection-url">Connection URL</Label>
              <Input
                id="connection-url"
                value={connectionUrl}
                onChange={(e) => setConnectionUrl(e.target.value)}
                placeholder="Enter database connection URL"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button variant="destructive" onClick={handleDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
