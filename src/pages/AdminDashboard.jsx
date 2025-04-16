import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import UserMonitoring from "@/components/admin/UserMonitoring";
import DatabaseConnection from "@/components/admin/DatabaseConnection";
import { useAuth, useAdmin } from "@/contexts/index";
import { usePropertyMapper } from "@/hooks/usePropertyMapper";

// Sample work items for demonstration
const SAMPLE_WORK_ITEMS = [
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
  const [users, setUsers] = useState([]);
  const [workItems, setWorkItems] = useState(SAMPLE_WORK_ITEMS);
  const { mapDatabaseToUI } = usePropertyMapper();
  
  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/login");
    }
    
    const loadUsers = async () => {
      const mockUsers = [
        {
          id: "1",
          username: "testuser",
          email: "user@example.com",
          role: "user",
          profile_picture: "",
          allowed_software: ["VS CODE", "JUPYTER NOTEBOOK", "POSTMAN", "GITHUB"],
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          profile_picture: "",
          created_at: new Date().toISOString()
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
  
  const handleDeleteUser = (userId) => {
    if (userId === currentUser?.id) {
      logout();
      navigate("/");
      return;
    }
    
    setUsers(users.filter(user => user.id !== userId));
    
    setWorkItems(workItems.filter(item => item.user_id !== userId));
  };
  
  const handleUpdateUserSoftware = (userId, software) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, allowedSoftware: software } : user
    ));
  };
  
  const handleAcceptWork = (workItemId) => {
    setWorkItems(workItems.map(item => 
      item.id === workItemId ? { ...item, status: "accepted" } : item
    ));
  };
  
  const handleRejectWork = (workItemId) => {
    setWorkItems(workItems.map(item => 
      item.id === workItemId ? { ...item, status: "rejected" } : item
    ));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-600">
                Welcome, <span className="text-purple-600">{currentUser.username}</span>
              </div>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-purple-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white shadow-md">
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-50">Users</TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-purple-50">Monitoring</TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-purple-50">Database</TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Management</h2>
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
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Activity and Work Submissions</h2>
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
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Database Connection</h2>
              <DatabaseConnection />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
