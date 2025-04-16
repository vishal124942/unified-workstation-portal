import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserManagement from "@/components/admin/UserManagement";
import UserMonitoring from "@/components/admin/UserMonitoring";
import DatabaseConnection from "@/components/admin/DatabaseConnection";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from "@/contexts/index";
import { useAuth } from "@/contexts/index";

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const { users, workItems } = useAdmin();
  const [userCount, setUserCount] = useState(0);
  const [workItemCount, setWorkItemCount] = useState(0);

  useEffect(() => {
    setUserCount(users?.length || 0);
    setWorkItemCount(workItems?.length || 0);
  }, [users, workItems]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging you out.",
      });
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Number of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Work Items</CardTitle>
            <CardDescription>Number of submitted work items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workItemCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
            <CardDescription>Connection and health status</CardDescription>
          </CardHeader>
          <CardContent>
            <DatabaseConnection />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="monitoring">User Monitoring</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="monitoring">
          <UserMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
