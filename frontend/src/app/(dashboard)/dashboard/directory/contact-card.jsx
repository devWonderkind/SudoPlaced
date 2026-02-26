import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Linkedin, Building2, MoreHorizontal, Pen, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ContactCard({ contact, onEdit, onDelete }) {
  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={contact.profile_image_url} alt={`${contact.first_name} ${contact.last_name}`} />
          <AvatarFallback>{getInitials(contact.first_name, contact.last_name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-lg">
            {contact.first_name} {contact.last_name}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
             {contact.designation && <span>{contact.designation}</span>}
             {contact.company && (
                <>
                  <span>@</span>
                  <span className="font-medium text-foreground">{contact.company}</span>
                </>
             )}
          </CardDescription>
        </div>
        <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(contact)}>
                  <Pen className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(contact.id)} className="text-destructive focus:text-destructive">
                   <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        {contact.email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${contact.email}`} className="hover:underline">
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <a href={`tel:${contact.phone}`} className="hover:underline">
              {contact.phone}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
            {contact.linkedin_url && (
                <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                    </Button>
                </a>
            )}
            {/* Add more social icons if needed */}
        </div>
        {contact.context_notes && (
            <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded-md line-clamp-2">
                {contact.context_notes}
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
         <Badge variant={contact.privacy_status === 'Private' ? 'secondary' : 'default'}>
            {contact.privacy_status}
         </Badge>
         <span>Added {new Date(contact.created_at).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
}
