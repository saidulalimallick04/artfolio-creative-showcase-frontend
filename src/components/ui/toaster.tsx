"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast()

  const getIcon = (variant: any) => {
    const iconClasses = "h-5 w-5 shrink-0";
    switch (variant) {
      case 'destructive':
        return <AlertCircle className={`${iconClasses} text-red-600`} />;
      case 'success':
        return <CheckCircle2 className={`${iconClasses} text-green-600`} />;
      case 'info':
        return <Info className={`${iconClasses} text-blue-600`} />;
      default:
        return <CheckCircle2 className={`${iconClasses} text-gray-600`} />;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} className="p-0"> {/* Remove default padding to control it inner */}
            <div className="flex w-full items-start gap-3 p-4 pr-10">
              {/* Icon with animated background */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/80 shadow-sm border border-gray-200/50">
                {getIcon(variant)}
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-center gap-1 flex-1 min-w-0 pt-0.5">
                {title && (
                  <ToastTitle className="text-base font-semibold leading-tight">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm opacity-90 leading-snug">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="absolute top-3 right-3 rounded-lg p-1.5 transition-colors hover:bg-black/10 active:bg-black/20 text-foreground/50 opacity-100" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
