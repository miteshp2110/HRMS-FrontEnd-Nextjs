import { PayrollDetailPage } from "@/components/payroll/payroll-detail-page"

interface PayrollDetailPageProps {
  params: {
    id: string
  }
}

export default function PayrollDetailPageRoute({ params }: PayrollDetailPageProps) {
  return <PayrollDetailPage payrollId={params.id} />
}
