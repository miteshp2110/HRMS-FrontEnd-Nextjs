"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getLeaveLedger, type LeaveBalance, type LeaveLedgerEntry } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowDown, ArrowUp, BookOpen, Calendar, TrendingUp, ExternalLink } from "lucide-react"
import Link from "next/link"

interface LeaveLedgerDialogProps {
  leaveBalance: LeaveBalance | null
  employeeId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Skeleton Component
function LedgerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead className="text-center">Change</TableHead>
            <TableHead className="text-center">Balance</TableHead>
            <TableHead className="text-right">Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function LeaveLedgerDialog({ leaveBalance, employeeId, open, onOpenChange }: LeaveLedgerDialogProps) {
  const { toast } = useToast()
  const [ledger, setLedger] = React.useState<LeaveLedgerEntry[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [timezone, setTimezone] = React.useState('UTC')

  React.useEffect(() => {
    const savedTimezone = localStorage.getItem("selectedTimezone")
    if (savedTimezone) {
      setTimezone(savedTimezone)
    }
  }, [])

  React.useEffect(() => {
    if (open && employeeId && leaveBalance) {
      const fetchLedger = async () => {
        setIsLoading(true)
        try {
          const data = await getLeaveLedger(employeeId, leaveBalance.id)
          setLedger(data)
        } catch (error: any) {
          toast({ 
            title: "Error", 
            description: `Failed to fetch leave ledger: ${error.message}`, 
            variant: "destructive" 
          })
        } finally {
          setIsLoading(false)
        }
      }
      fetchLedger()
    }
  }, [open, employeeId, leaveBalance, toast])
  
  if (!leaveBalance) return null
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(undefined, { 
      timeZone: timezone, 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    })
  }

  // Calculate statistics
  const totalCredits = ledger
    .filter(entry => parseFloat(entry.change_amount) > 0)
    .reduce((sum, entry) => sum + parseFloat(entry.change_amount), 0)
  
  const totalDebits = ledger
    .filter(entry => parseFloat(entry.change_amount) < 0)
    .reduce((sum, entry) => sum + Math.abs(parseFloat(entry.change_amount)), 0)

  const currentBalance = leaveBalance.balance

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-primary" />
            Leave Ledger: {leaveBalance.leave_type_name}
          </DialogTitle>
          <DialogDescription>
            Complete transactional history showing all credits and debits for this leave type
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 max-h-[70vh] overflow-y-auto space-y-6">
          {isLoading ? (
            <LedgerSkeleton />
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 dark:border-green-900">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Credits</p>
                        <p className="text-2xl font-bold text-green-600">
                          +{totalCredits.toFixed(1)}
                        </p>
                      </div>
                      <ArrowUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Debits</p>
                        <p className="text-2xl font-bold text-red-600">
                          -{totalDebits.toFixed(1)}
                        </p>
                      </div>
                      <ArrowDown className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 dark:border-blue-900">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {currentBalance}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Transaction Table */}
              {ledger.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-muted rounded-full">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
                  <p className="text-muted-foreground">
                    No transaction history found for this leave type.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date
                          </div>
                        </TableHead>
                        <TableHead>Transaction Type</TableHead>
                        <TableHead className="text-center">Change</TableHead>
                        <TableHead className="text-center">Balance Flow</TableHead>
                        <TableHead className="text-right">Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledger.map((entry) => {
                        const changeAmount = parseFloat(entry.change_amount)
                        const isCredit = changeAmount > 0

                        return (
                          <TableRow key={entry.id} className="hover:bg-muted/50">
                            <TableCell className="text-sm">
                              {formatTimestamp(entry.transaction_date)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className="capitalize"
                              >
                                {entry.transaction_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={`inline-flex items-center gap-1.5 font-semibold px-3 py-1 rounded-full ${
                                isCredit 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' 
                                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                              }`}>
                                {isCredit ? (
                                  <ArrowUp className="h-3.5 w-3.5" />
                                ) : (
                                  <ArrowDown className="h-3.5 w-3.5" />
                                )}
                                {changeAmount > 0 ? '+' : ''}{changeAmount}
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-mono text-sm">
                              <span className="text-muted-foreground">{entry.previous_balance}</span>
                              {' → '}
                              <span className="font-semibold text-foreground">{entry.new_balance}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.leave_record_id ? (
                                <Button 
                                  variant="link" 
                                  asChild 
                                  className="h-auto p-0 text-primary"
                                  size="sm"
                                >
                                  <Link 
                                    href={`/management/leaves/${entry.leave_record_id}`}
                                    className="flex items-center gap-1"
                                  >
                                    View Request
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                </Button>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {!isLoading && ledger.length > 0 && (
                <span>Showing {ledger.length} transaction{ledger.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
