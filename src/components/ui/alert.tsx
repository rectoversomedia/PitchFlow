import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error" | "warning" | "info"
  title?: string
}

export function Alert({
  className,
  variant = "default",
  title,
  children,
  ...props
}: AlertProps) {
  const variantStyles = {
    default: "bg-slate-800 border-slate-700 text-slate-200",
    success: "bg-green-900/50 border-green-700 text-green-200",
    error: "bg-red-900/50 border-red-700 text-red-200",
    warning: "bg-amber-900/50 border-amber-700 text-amber-200",
    info: "bg-blue-900/50 border-blue-700 text-blue-200",
  }

  const iconStyles = {
    default: "text-slate-400",
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-amber-400",
    info: "text-blue-400",
  }

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4",
        variantStyles[variant],
        className
      )}
      role="alert"
      {...props}
    >
      {title && (
        <h5 className={cn("mb-1 font-medium", iconStyles[variant])}>
          {title}
        </h5>
      )}
      <div className="text-sm [&_p]:mt-1">
        {children}
      </div>
    </div>
  )
}
