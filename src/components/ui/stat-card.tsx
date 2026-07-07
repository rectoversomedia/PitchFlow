import { cn } from "@/lib/utils"
import { LucideIcon, FileText, Users, Briefcase, TrendingUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon = TrendingUp,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-slate-900 border border-slate-800 rounded-lg p-6",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-sm font-medium mt-2",
                trend.isPositive ? "text-green-400" : "text-red-400"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <Icon className="h-6 w-6 text-slate-400" />
        </div>
      </div>
    </div>
  )
}

// Pre-configured stat cards for common metrics
export function ProposalCountCard({ count }: { count: number }) {
  return (
    <StatCard
      title="Total Proposals"
      value={count}
      icon={FileText}
      description="Active sponsorship proposals"
    />
  )
}

export function ClientCountCard({ count }: { count: number }) {
  return (
    <StatCard
      title="Active Clients"
      value={count}
      icon={Users}
      description="Brand partnerships"
    />
  )
}

export function BriefCountCard({ count }: { count: number }) {
  return (
    <StatCard
      title="Open Briefs"
      value={count}
      icon={Briefcase}
      description="Pending proposals"
    />
  )
}
