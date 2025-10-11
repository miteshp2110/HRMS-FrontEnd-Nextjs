// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { getMyReports, UserProfile } from "@/lib/api";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Eye } from "lucide-react";

// export function MyReportsPage() {
//   const [reports, setReports] = useState<UserProfile[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const data = await getMyReports();
//         setReports(data);
//       } catch (error) {
//         console.error("Failed to fetch direct reports:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchReports();
//   }, []);

//   const getInitials = (firstName: string = "", lastName: string = "") => {
//     return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
//   };

//   const getStatusBadge = (isActive: boolean) => {
//     return (
//       <Badge
//         variant={isActive ? "default" : "secondary"}
//         className={
//           isActive
//             ? "bg-green-100 text-green-800"
//             : "bg-red-100 text-red-800"
//         }
//       >
//         {isActive ? "Active" : "Inactive"}
//       </Badge>
//     );
//   };

//   const renderLoadingSkeleton = () => (
//     <TableRow>
//         <TableCell colSpan={5} className="h-24 text-center">
//              <div className="flex items-center justify-center">
//                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                  <p className="ml-4 text-muted-foreground">Loading your team...</p>
//              </div>
//         </TableCell>
//     </TableRow>
//   );

//   const renderEmptyState = () => (
//     <TableRow>
//       <TableCell colSpan={5} className="h-24 text-center">
//         You have no direct reports.
//       </TableCell>
//     </TableRow>
//   );

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>My Team</CardTitle>
//         <CardDescription>
//           A list of employees who report directly to you.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Employee</TableHead>
//                 <TableHead>Job Title</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading
//                 ? renderLoadingSkeleton()
//                 : reports.length === 0
//                 ? renderEmptyState()
//                 : reports.map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage
//                                 className="object-cover"
//                               src={user.profile_url || undefined}
//                               alt={`${user.first_name} ${user.last_name}`}
//                             />
//                             <AvatarFallback>
//                               {getInitials(user.first_name, user.last_name)}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="font-medium">
//                               {user.first_name} {user.last_name}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               {user.full_employee_id}
//                             </p>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{user.job_title || "—"}</TableCell>
//                       <TableCell>{user.email}</TableCell>
//                       <TableCell>{getStatusBadge(user.is_active)}</TableCell>
//                       <TableCell className="text-right">
//                         <Button variant="ghost" size="icon" asChild>
//                           <Link href={`/directory/${user.id}`}>
//                             <Eye className="h-4 w-4" />
//                           </Link>
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyReports, UserProfile } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";

export function MyReportsPage() {
  const [reports, setReports] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getMyReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch direct reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getInitials = (firstName: string = "", lastName: string = "") => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={
          isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const renderLoadingSkeleton = () => (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        You have no direct reports.
      </TableCell>
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Team</CardTitle>
        <CardDescription>
          A list of employees who report directly to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? renderLoadingSkeleton()
                : reports.length === 0
                ? renderEmptyState()
                : reports.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              className="object-cover"
                              src={user.profile_url || undefined}
                              alt={`${user.first_name} ${user.last_name}`}
                            />
                            <AvatarFallback>
                              {getInitials(user.first_name, user.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.full_employee_id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.job_title || "—"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/directory/${user.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
