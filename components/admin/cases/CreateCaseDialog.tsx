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
  createCase,
  searchUsers,
  getCaseCategories,
  type UserProfile,
  type CaseCategory,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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

interface CreateCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCaseDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCaseDialogProps) {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<CaseCategory[]>([]);
  const [employeeSearch, setEmployeeSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(
    null
  );
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      getCaseCategories().then(setCategories);
    }
  }, [open]);

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
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.set("employee_id", String(selectedUser?.id || ""));

    try {
      await createCase(formData);
      toast({ title: "Success", description: "Case created successfully." });
      onSuccess();
      onOpenChange(false);
      form.reset();
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create case: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New HR Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Employee</Label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  role="button"
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
            <Label>Category</Label>
            <Select name="category_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input name="title" required />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea name="description" required />
          </div>
          <div className="grid gap-2">
            <Label>Deduction Amount </Label>
            <Input name="deduction_amount" type="number" />
          </div>
          <div className="grid gap-2">
            <Label>Evidence </Label>
            <Input name="evidence" type="file" />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Case</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
