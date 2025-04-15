
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SoftwareCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  onLaunch: () => void;
}

export default function SoftwareCard({ name, description, icon, onLaunch }: SoftwareCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="w-12 h-12 flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onLaunch} className="w-full">Launch</Button>
      </CardFooter>
    </Card>
  );
}
