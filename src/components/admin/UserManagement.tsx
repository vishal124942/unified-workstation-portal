
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserProfile } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyMapper } from "@/hooks/usePropertyMapper";

// List of all available software
const ALL_SOFTWARE = [
  "VS CODE", "JUPYTER NOTEBOOK", "POSTMAN", "MLFLOW", "KUBEFLOW", "AIRFLOW",
  "PINECONE", "PROMETHESUS", "GRAFANA", "DEVOPS", "AUTOML", "LLMOPS", "GITHUB"
];

interface UserManagementProps {
  users: UserProfile[];
  currentUserId: string;
  onDeleteUser: (userId: string) => void;
  onUpdateUserSoftware: (userId: string, software: string[]) => void;
}

export default function UserManagement({ 
  users, 
  currentUserId,
  onDeleteUser,
  onUpdateUserSoftware
}: UserManagementProps) {
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([]);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<string | null>(null);
  const { toast } = useToast();
  const { mapDatabaseToUI } = usePropertyMapper();
  
  const handleEditSoftware = (user: UserProfile) => {
    const uiUser = mapDatabaseToUI(user);
    setEditingUser(user);
    setSelectedSoftware(uiUser.allowedSoftware || []);
  };
  
  const handleSaveSoftware = () => {
    if (!editingUser) return;
    
    onUpdateUserSoftware(editingUser.id, selectedSoftware);
    setEditingUser(null);
    
    toast({
      title: "Software access updated",
      description: `Software access for ${editingUser.username} has been updated.`,
    });
  };
  
  const handleSoftwareChange = (software: string, checked: boolean) => {
    if (checked) {
      setSelectedSoftware([...selectedSoftware, software]);
    } else {
      setSelectedSoftware(selectedSoftware.filter(s => s !== software));
    }
  };
  
  const handleConfirmDelete = () => {
    if (!confirmDeleteUser) return;
    
    onDeleteUser(confirmDeleteUser);
    setConfirmDeleteUser(null);
    
    toast({
      title: "User deleted",
      description: "The user has been deleted successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Software Access</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const uiUser = mapDatabaseToUI(user);
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={uiUser.profilePicture} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {uiUser.allowedSoftware?.map((software) => (
                        <Badge key={software} variant="outline" className="text-xs">
                          {software}
                        </Badge>
                      ))}
                      {(!uiUser.allowedSoftware || uiUser.allowedSoftware.length === 0) && (
                        <span className="text-xs text-muted-foreground">No software assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditSoftware(user)}
                      >
                        Edit Software
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setConfirmDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Software Dialog */}
      {editingUser && (
        <Dialog open onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Software Access</DialogTitle>
              <DialogDescription>
                Set the software that {editingUser.username} can access.
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {ALL_SOFTWARE.map((software) => (
                  <div key={software} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`software-${software}`} 
                      checked={selectedSoftware.includes(software)}
                      onCheckedChange={(checked) => 
                        handleSoftwareChange(software, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`software-${software}`}
                      className="flex-1 cursor-pointer"
                    >
                      {software}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <DialogFooter>
              <Button onClick={handleSaveSoftware}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Confirm Delete Dialog */}
      {confirmDeleteUser && (
        <Dialog open onOpenChange={(open) => !open && setConfirmDeleteUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                {confirmDeleteUser === currentUserId 
                  ? "Are you sure you want to delete your admin account? This action cannot be undone."
                  : "Are you sure you want to delete this user? This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfirmDeleteUser(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
