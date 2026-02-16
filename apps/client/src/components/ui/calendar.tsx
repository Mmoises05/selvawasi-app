
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-4", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "text-lg font-bold text-slate-100 font-cinzel capitalize tracking-widest",
                nav: "space-x-1 flex items-center bg-slate-800/50 rounded-full p-1 border border-slate-700",
                nav_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-7 w-7 bg-transparent p-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-full transition-all"
                ),
                nav_button_previous: "!absolute left-2 top-2", // absolute positioning might conflict with centered caption if not careful, but works for standard shadcn
                nav_button_next: "!absolute right-2 top-2",
                table: "w-full border-collapse space-y-1",
                head_row: "grid grid-cols-7 mb-2",
                head_cell:
                    "text-slate-500 rounded-md w-9 font-bold text-[0.8rem] uppercase tracking-wider h-9 flex items-center justify-center",
                row: "grid grid-cols-7 mt-2 w-full",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-emerald-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-medium aria-selected:opacity-100 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "!bg-emerald-500 !text-white hover:!bg-emerald-600 focus:!bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
                day_today: "bg-slate-800 text-white font-bold border border-emerald-500/50",
                day_outside:
                    "text-slate-600 opacity-30 aria-selected:bg-emerald-900/20 aria-selected:text-slate-400",
                day_disabled: "text-slate-700 opacity-30",
                day_range_middle:
                    "aria-selected:bg-emerald-900/30 aria-selected:text-emerald-300",
                day_hidden: "invisible",
                ...classNames,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
