'use client';

import React from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getApplication } from '@/api/applications';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export function ApplicationDetailDialog({ applicationId, open, onOpenChange }) {
  const { data: application, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => getApplication(applicationId),
    enabled: !!applicationId && open,
  });

  if (!applicationId && !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col gap-0 p-0">
        {isLoading || !application ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 pb-2">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border bg-white shadow-sm">
                  <AvatarImage src={application.company_logo} className="object-contain p-2" />
                  <AvatarFallback className="text-xl">
                    {application.company_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold">{application.role_title}</DialogTitle>
                  <div className="text-muted-foreground flex items-center gap-2 text-lg font-medium">
                    {application.company_name}
                    {application.job_url && (
                      <a
                        href={application.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="ml-1 inline h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <Badge
                  variant={getStatusVariant(application.status_label)}
                  className="px-3 py-1 text-base"
                >
                  {application.status_label || 'Unknown'}
                </Badge>
              </div>
            </DialogHeader>

            <Tabs defaultValue="details" className="flex min-h-0 flex-1 flex-col">
              <div className="px-6">
                <TabsList className="h-auto w-full justify-start space-x-6 rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:shadow-none"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:shadow-none"
                  >
                    Timeline
                  </TabsTrigger>{' '}
                  {/* Placeholder for History */}
                  <TabsTrigger
                    value="contacts"
                    className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:shadow-none"
                  >
                    Contacts ({application.hr_contacts?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:shadow-none"
                  >
                    Notes
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1 p-6">
                <TabsContent value="details" className="mt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem icon={MapPin} label="Location" value={application.location} />
                    <DetailItem icon={Briefcase} label="Work Mode" value={application.work_mode} />
                    <DetailItem
                      icon={DollarSign}
                      label="Salary Expectation"
                      value={application.expected_salary}
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Applied On"
                      value={
                        application.applied_on
                          ? format(new Date(application.applied_on), 'PPP')
                          : 'Not set'
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="mt-0">
                  <p className="text-muted-foreground text-sm italic">
                    Status history coming soon...
                  </p>
                  {/* TODO: Implement Timeline using application.history */}
                </TabsContent>

                <TabsContent value="contacts" className="mt-0 space-y-4">
                  {application.hr_contacts?.length > 0 ? (
                    application.hr_contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-card/50 flex items-center gap-3 rounded-lg border p-3"
                      >
                        <Avatar>
                          <AvatarFallback>{contact?.first_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{contact?.first_name} {contact?.last_name}</div>
                          <div className="text-muted-foreground text-sm">{contact?.company}</div>
                          <div className="text-muted-foreground text-xs">{contact?.designation}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No contacts linked.</p>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <p className="text-muted-foreground text-sm">Notes functionality coming soon.</p>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="font-medium">{value || '—'}</div>
    </div>
  );
}

function getStatusVariant(status) {
  if (['Applied', 'Assessment'].includes(status)) return 'outline';
  if (['Interviewing', 'Offered'].includes(status)) return 'default';
  if (['Rejected', 'Ghosted'].includes(status)) return 'destructive';
  return 'secondary';
}
