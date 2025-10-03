"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { initiateSettlement, searchUsers, type UserProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface InitiateSettlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InitiateSettlementDialog({
  open,
  onOpenChange,
  onSuccess,
}: InitiateSettlementDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    employee_id: 0,
    termination_type: "",
    last_working_date: "",
    termination_reason: "",
    notes: "",
  });
  const [employeeSearch, setEmployeeSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(
    null
  );
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(employeeSearch), 300);
    return () => clearTimeout(handler);
  }, [employeeSearch]);

  React.useEffect(() => {
    if (debouncedSearch) {
      searchUsers(debouncedSearch).then(setSearchedUsers);
    } else {
      setSearchedUsers([]);
    }
  }, [debouncedSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await initiateSettlement(formData);
      toast({
        title: "Success",
        description: "Settlement initiated successfully.",
      });
      onSuccess();
      onOpenChange(false);
      setFormData({
        employee_id: 0,
        termination_type: "",
        last_working_date: "",
        termination_reason: "",
        notes: "",
      });
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to initiate: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initiate New Settlement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Employee *</Label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  
                  className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {selectedUser
                    ? `${selectedUser.first_name} ${selectedUser.last_name}`
                    : "Select employee..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search employee..."
                    onValueChange={setEmployeeSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No employee found.</CommandEmpty>
                    <CommandGroup>
                      {searchedUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.first_name} ${user.last_name}`}
                          onSelect={() => {
                            setFormData((d) => ({
                              ...d,
                              employee_id: user.id,
                            }));
                            setSelectedUser(user);
                            setIsPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedUser?.id === user.id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {user.first_name} {user.last_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Termination Type *</Label>
            <Select
              required
              onValueChange={(v) =>
                setFormData({ ...formData, termination_type: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Resignation">Resignation</SelectItem>
                <SelectItem value="Termination">Termination</SelectItem>
                <SelectItem value="End of Contract">End of Contract</SelectItem>
                <SelectItem value="Retirement">Retirement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Last Working Date *</Label>
            <Input
              type="date"
              required
              onChange={(e) =>
                setFormData({ ...formData, last_working_date: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Termination Reason</Label>
            <Textarea
              onChange={(e) =>
                setFormData({ ...formData, termination_reason: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Initiating..." : "Initiate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
