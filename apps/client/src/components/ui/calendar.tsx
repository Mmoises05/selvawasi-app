
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
                caption_label: "text-base font-semibold text-slate-800 font-cinzel capitalize",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-7 w-7 bg-transparent p-0 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                ),
                nav_button_previous: "!absolute left-1 top-1",
                nav_button_next: "!absolute right-1 top-1",
                table: "w-full border-collapse", // Standard table collapse
                head_row: "flex justify-between w-full mb-2", // Flex headers
                head_cell:
                    "text-slate-400 rounded-md w-9 font-bold text-[0.7rem] uppercase tracking-wider h-9 flex items-center justify-center", // Centered headers
                row: "flex w-full mt-2 justify-between", // Flex rows with space-between
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-emerald-50/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 !flex !justify-center !items-center !m-0 !p-0",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-medium aria-selected:opacity-100 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors !flex !justify-center !items-center" // Rounded days
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white focus:bg-emerald-700 focus:text-white shadow-md",
                day_today: "bg-slate-100 text-slate-900 font-bold border border-slate-200",
                day_outside:
                    "day-outside text-slate-300 opacity-50 aria-selected:bg-emerald-50/50 aria-selected:text-slate-500",
                day_disabled: "text-slate-300 opacity-50",
                day_range_middle:
                    "aria-selected:bg-emerald-50 aria-selected:text-emerald-900",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
