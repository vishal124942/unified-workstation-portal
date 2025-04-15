
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import SoftwareCard from "@/components/user/SoftwareCard";
import ProfileSection from "@/components/user/ProfileSection";
import WorkSubmitDialog from "@/components/user/WorkSubmitDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Icons for software
import { 
  Code, 
  FileCode, 
  Send, 
  Workflow, 
  Database, 
  LineChart, 
  BarChart, 
  GitBranch, 
  Bot, 
  Braces 
} from "lucide-react";

// Software descriptions
const SOFTWARE_DESCRIPTIONS = {
  "VS CODE": "Code editing. Redefined.",
  "JUPYTER NOTEBOOK": "Interactive computing notebook",
  "POSTMAN": "API platform for building and using APIs",
  "MLFLOW": "An open source platform for the machine learning lifecycle",
  "KUBEFLOW": "The Machine Learning Toolkit for Kubernetes",
  "AIRFLOW": "Platform to programmatically author, schedule, and monitor workflows",
  "PINECONE": "Vector database for machine learning applications",
  "PROMETHESUS": "Monitoring system & time series database",
  "GRAFANA": "Analytics & monitoring solution",
  "DEVOPS": "Development operations tools",
  "AUTOML": "Automated machine learning",
  "LLMOPS": "Large language model operations",
  "GITHUB": "Development platform inspired by the way you work"
};

// Map software names to icons
const SOFTWARE_ICONS = {
  "VS CODE": <Code size={24} />,
  "JUPYTER NOTEBOOK": <FileCode size={24} />,
  "POSTMAN": <Send size={24} />,
  "MLFLOW": <LineChart size={24} />,
  "KUBEFLOW": <Workflow size={24} />,
  "AIRFLOW": <Workflow size={24} />,
  "PINECONE": <Database size={24} />,
  "PROMETHESUS": <BarChart size={24} />,
  "GRAFANA": <BarChart size={24} />,
  "DEVOPS": <Braces size={24} />,
  "AUTOML": <Bot size={24} />,
  "LLMOPS": <Bot size={24} />,
  "GITHUB": <GitBranch size={24} />
};

export default function UserDashboard() {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeSoftware, setActiveSoftware] = useState<string | null>(null);
  
  useEffect(() => {
    // If not a user, redirect to login
    if (currentUser?.role !== "user") {
      navigate("/login");
    }
  }, [currentUser, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const handleLaunchSoftware = (softwareName: string) => {
    // Set the active software
    setActiveSoftware(softwareName);
    
    // In a real implementation, this would use SSO to launch the actual application
    toast({
      title: "Launching Software",
      description: `Launching ${softwareName} with automatic sign-on...`,
    });
    
    // Simulate opening the software in a new tab
    setTimeout(() => {
      window.open("about:blank", "_blank");
    }, 1000);
  };
  
  const handleSubmitWork = async (content: string) => {
    if (!activeSoftware) return;
    
    // In a real implementation, this would send the work to a backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Work Saved",
      description: `Your ${activeSoftware} work has been saved and submitted.`,
    });
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
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">
              Welcome, {currentUser.username}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="software" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          {/* Software Tab */}
          <TabsContent value="software" className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Your Allowed Software</h2>
              
              {currentUser.allowedSoftware && currentUser.allowedSoftware.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentUser.allowedSoftware.map((software) => (
                    <SoftwareCard
                      key={software}
                      name={software}
                      description={SOFTWARE_DESCRIPTIONS[software as keyof typeof SOFTWARE_DESCRIPTIONS] || ""}
                      icon={SOFTWARE_ICONS[software as keyof typeof SOFTWARE_ICONS] || <Code size={24} />}
                      onLaunch={() => handleLaunchSoftware(software)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    You don't have any software assigned yet. Please contact your administrator.
                  </p>
                </div>
              )}
            </div>
            
            {activeSoftware && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Active Software: {activeSoftware}
                  </h2>
                  <WorkSubmitDialog 
                    softwareName={activeSoftware} 
                    onSubmit={handleSubmitWork} 
                  />
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-muted-foreground">
                    This is a simulation of the {activeSoftware} environment. In a real implementation, 
                    this would be integrated with the actual application using SSO.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
              <ProfileSection />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
