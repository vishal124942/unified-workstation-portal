
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import UserMonitoring from "@/components/admin/UserMonitoring";
import DatabaseConnection from "@/components/admin/DatabaseConnection";
import { useAuth, UserProfile, useAdmin } from "@/contexts/AuthContext";
import { WorkItem } from "@/lib/supabase";
import { usePropertyMapper } from "@/hooks/usePropertyMapper";

// Sample work items for demonstration
const SAMPLE_WORK_ITEMS: WorkItem[] = [
  {
    id: "1",
    user_id: "1",
    software: "VS CODE",
    content: "// This is a sample code submission\nfunction helloWorld() {\n  console.log('Hello, World!');\n}\n\nhelloWorld();",
    status: "pending",
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "2",
    user_id: "1",
    software: "JUPYTER NOTEBOOK",
    content: "# Data Analysis\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('data.csv')\ndf.head()",
    status: "accepted",
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>(SAMPLE_WORK_ITEMS);
  const { mapDatabaseToUI } = usePropertyMapper();
  
  useEffect(() => {
    // If not an admin, redirect to login
    if (currentUser?.role !== "admin") {
      navigate("/login");
    }
    
    // Load users (simulating API call)
    const loadUsers = async () => {
      // In a real app, you would fetch this from an API
      const mockUsers: UserProfile[] = [
        {
          id: "1",
          username: "testuser",
          email: "user@example.com",
          role: "user",
          profile_picture: "",
          allowed_software: ["VS CODE", "JUPYTER NOTEBOOK", "POSTMAN", "GITHUB"]
        },
        {
          id: "2",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          profile_picture: ""
        }
      ];
      
      setUsers(mockUsers.map(user => mapDatabaseToUI(user)));
    };
    
    loadUsers();
  }, [currentUser, navigate, mapDatabaseToUI]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const handleDeleteUser = (userId: string) => {
    // If deleting yourself, logout
    if (userId === currentUser?.id) {
      logout();
      navigate("/");
      return;
    }
    
    // Otherwise, remove the user from the list
    setUsers(users.filter(user => user.id !== userId));
    
    // Also remove their work items
    setWorkItems(workItems.filter(item => item.user_id !== userId));
  };
  
  const handleUpdateUserSoftware = (userId: string, software: string[]) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, allowedSoftware: software } : user
    ));
  };
  
  const handleAcceptWork = (workItemId: string) => {
    setWorkItems(workItems.map(item => 
      item.id === workItemId ? { ...item, status: "accepted" } : item
    ));
  };
  
  const handleRejectWork = (workItemId: string) => {
    setWorkItems(workItems.map(item => 
      item.id === workItemId ? { ...item, status: "rejected" } : item
    ));
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">
              Admin: {currentUser.username}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">User Management</h2>
              <UserManagement 
                users={users}
                currentUserId={currentUser.id}
                onDeleteUser={handleDeleteUser}
                onUpdateUserSoftware={handleUpdateUserSoftware}
              />
            </div>
          </TabsContent>
          
          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">User Activity and Work Submissions</h2>
              <UserMonitoring 
                users={users}
                workItems={workItems}
                onAcceptWork={handleAcceptWork}
                onRejectWork={handleRejectWork}
              />
            </div>
          </TabsContent>
          
          {/* Database Tab */}
          <TabsContent value="database" className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Database Connection</h2>
              <DatabaseConnection />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
