import React from "react"
import { ShieldQuestionMarkIcon, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Tem certeza?",
  description = "Você tem certeza que deseja remover esta marcação de ponto? Esta ação não poderá ser desfeita.",
  confirmText = "Sim, Excluir",
  cancelText = "Não",
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const busy = isLoading || isSubmitting

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm rounded-2xl border border-[#27272a] bg-[#121214] text-[#fafafa] shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-2 p-8">
          <div className="flex size-12 items-center justify-center rounded-full bg-violet-50 text-violet-500 dark:bg-violet-950 dark:text-violet-400">
            <ShieldQuestionMarkIcon className="size-6" />
          </div>
          <AlertDialogTitle className="text-center font-semibold text-base text-[#fafafa]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="p-0 text-center font-medium text-sm text-[#a1a1aa]">
            {description}
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="grid w-full flex-none grid-cols-2 gap-0 divide-x divide-[#27272a] border-t border-[#27272a] py-0">
          <AlertDialogCancel
            asChild
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            <Button
              className="h-12 flex-1 rounded-none border-0 border-r border-[#27272a] p-0 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#1c1c20] cursor-pointer transition-colors"
              variant="ghost"
            >
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            disabled={busy}
            onClick={handleConfirm}
          >
            <Button
              className="h-12 flex-1 rounded-none border-0 p-0 text-rose-500 hover:text-rose-400 hover:bg-rose-950/30 font-semibold cursor-pointer transition-colors"
              variant="ghost"
            >
              {busy ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Excluindo...</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
