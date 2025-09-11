"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ChevronsUpDown, Search } from "lucide-react"
import { createExpense, searchUsers, type UserProfile } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExpenseAdded: () => void
}

export function AddExpenseDialog({ open, onOpenChange, onExpenseAdded }: AddExpenseDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({ employee_id: '', expense_title: '', expense_description: '', expense: '' });
  
  const [employeeSearch, setEmployeeSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createExpense({
        employee_id: Number(formData.employee_id),
        expense_title: formData.expense_title,
        expense_description: formData.expense_description,
        expense: Number(formData.expense)
      });
      toast({ title: "Success", description: "Expense added successfully." });
      onExpenseAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to add expense: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Expense Record</DialogTitle>
          <DialogDescription>Log a new expense incurred on behalf of an employee.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
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
                  <CommandInput placeholder="Search employee..." onValueChange={setEmployeeSearch} />
                  <CommandList>
                    <CommandEmpty>{isSearching ? "Searching..." : "No employee found."}</CommandEmpty>
                    <CommandGroup>
                      {searchedUsers.map(user => (
                        <CommandItem key={user.id} value={`${user.first_name} ${user.last_name}`} onSelect={() => {
                          setFormData(d => ({...d, employee_id: String(user.id)}));
                          setSelectedUser(user);
                          setIsPopoverOpen(false);
                        }}>
                          {user.first_name} {user.last_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="expense_title">Expense Title</Label><Input id="expense_title" name="expense_title" onChange={e => setFormData(f => ({...f, expense_title: e.target.value}))} required/></div>
            <div><Label htmlFor="expense">Amount ($)</Label><Input id="expense" name="expense" type="number" step="0.01" onChange={e => setFormData(f => ({...f, expense: e.target.value}))} required/></div>
          </div>
          <div><Label htmlFor="expense_description">Description</Label><Textarea id="expense_description" name="expense_description" onChange={e => setFormData(f => ({...f, expense_description: e.target.value}))}/></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Expense'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}