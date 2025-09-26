"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Search } from "lucide-react"
import { createExpenseAdvance, searchUsers, getExpenseCategories, type UserProfile, type ExpenseCategory } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AdvanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AdvanceDialog({ open, onOpenChange, onSuccess }: AdvanceDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = React.useState({
    employee_id: '',
    category_id: '',
    title: '',
    description: '',
    amount: '',
    expense_date: '',
  });
  
  const [categories, setCategories] = React.useState<ExpenseCategory[]>([])
  const [employeeSearch, setEmployeeSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
        getExpenseCategories().then(setCategories).catch(() => {
            toast({ title: "Error", description: "Could not load expense categories.", variant: "destructive" });
        });
    }
  }, [open, toast]);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(employeeSearch), 500);
    return () => clearTimeout(handler);
  }, [employeeSearch]);

  React.useEffect(() => {
    if (debouncedSearch) {
      setIsSearching(true);
      searchUsers(debouncedSearch).then(setSearchedUsers).finally(() => setIsSearching(false));
    } else {
      setSearchedUsers([]);
    }
  }, [debouncedSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createExpenseAdvance({
        employee_id: Number(formData.employee_id),
        category_id: Number(formData.category_id),
        title: formData.title,
        description: formData.description,
        amount: Number(formData.amount),
        expense_date: formData.expense_date,
      });

      toast({ title: "Success", description: "Expense advance created successfully." });
      onSuccess();
      onOpenChange(false);
      // Reset form
      setFormData({
        employee_id: '',
        category_id: '',
        title: '',
        description: '',
        amount: '',
        expense_date: '',
      });
      setSelectedUser(null);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to create advance: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Expense Advance</DialogTitle>
          <DialogDescription>
            Provide an employee with an advance for upcoming expenses. This will mark it as 'Approved'.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Employee *</Label>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <button
                    type="button"
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
                    <CommandInput placeholder="Search employee..." onValueChange={setEmployeeSearch} />
                    <CommandList>
                        <CommandEmpty>{isSearching ? "Searching..." : "No employee found."}</CommandEmpty>
                        <CommandGroup>
                        {searchedUsers.map((user) => (
                            <CommandItem
                            key={user.id}
                            value={`${user.first_name} ${user.last_name}`}
                            onSelect={() => {
                                setFormData(d => ({...d, employee_id: String(user.id)}));
                                setSelectedUser(user);
                                setIsPopoverOpen(false);
                            }}
                            >
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
            <Label htmlFor="category_id">Category *</Label>
            <Select name="category_id" required onValueChange={(value) => setFormData({...formData, category_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2"><Label htmlFor="title">Title *</Label><Input id="title" name="title" required onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
          <div className="grid gap-2"><Label htmlFor="amount">Amount *</Label><Input id="amount" name="amount" type="number" step="0.01" required onChange={(e) => setFormData({...formData, amount: e.target.value})}/></div>
          <div className="grid gap-2"><Label htmlFor="expense_date">Date *</Label><Input id="expense_date" name="expense_date" type="date" required onChange={(e) => setFormData({...formData, expense_date: e.target.value})}/></div>
          <div className="grid gap-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Advance'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}