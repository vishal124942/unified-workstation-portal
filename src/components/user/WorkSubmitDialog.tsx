
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface WorkSubmitDialogProps {
  softwareName: string;
  onSubmit: (content: string) => Promise<void>;
}

export default function WorkSubmitDialog({ softwareName, onSubmit }: WorkSubmitDialogProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Empty submission",
        description: "Please add some content to submit.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
      setIsOpen(false);
      toast({
        title: "Work submitted",
        description: `Your ${softwareName} work has been submitted to the admin.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your work.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Submit Work</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit {softwareName} Work</DialogTitle>
          <DialogDescription>
            Submit your work to the admin for review.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="work-content">Work Content</Label>
            <Textarea
              id="work-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter your ${softwareName} work here...`}
              className="min-h-[200px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
