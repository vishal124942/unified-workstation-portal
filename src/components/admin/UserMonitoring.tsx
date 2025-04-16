
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyMapper } from "@/hooks/usePropertyMapper";
import { UserProfile, WorkItem, UIWorkItem } from "@/types";

interface UserMonitoringProps {
  users: UserProfile[];
  workItems: WorkItem[];
  onAcceptWork: (workItemId: string) => void;
  onRejectWork: (workItemId: string) => void;
}

export default function UserMonitoring({ 
  users, 
  workItems, 
  onAcceptWork, 
  onRejectWork 
}: UserMonitoringProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const { toast } = useToast();
  const { mapWorkItemToUI } = usePropertyMapper();
  
  const uiWorkItems: UIWorkItem[] = workItems.map(item => {
    const user = users.find(user => user.id === item.user_id);
    return mapWorkItemToUI(item, user?.username);
  });
  
  const filteredWorkItems = selectedUserId === "all"
    ? uiWorkItems
    : uiWorkItems.filter(item => item.userId === selectedUserId);
  
  const handleAcceptWork = (workItemId: string) => {
    onAcceptWork(workItemId);
    toast({
      title: "Work accepted",
      description: "The work item has been accepted.",
    });
  };
  
  const handleRejectWork = (workItemId: string) => {
    onRejectWork(workItemId);
    toast({
      title: "Work rejected",
      description: "The work item has been rejected.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.filter(user => user.role === "user").map(user => (
              <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {filteredWorkItems.length > 0 ? (
          filteredWorkItems.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{item.username}</CardTitle>
                    <CardDescription>
                      Software: {item.software} • {item.displayDate}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    item.status === "accepted" ? "default" : 
                    item.status === "rejected" ? "destructive" : 
                    "outline"
                  }>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-gray-50 mb-4 whitespace-pre-wrap">
                  {item.content}
                </div>
                
                {item.status === "pending" && (
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleRejectWork(item.id)}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleAcceptWork(item.id)}
                    >
                      Accept
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              {selectedUserId !== "all" 
                ? "This user has not submitted any work yet."
                : "No work submissions have been received yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
