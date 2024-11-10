import * as React from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  onChange: (date: Date | undefined) => void;
  value: Date | undefined | null;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  onChange,
  value,
  title = "Selecione uma data",
  className,
  disabled = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined | null>(value);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const CalendarPortal = ({ children }: { children: React.ReactNode }) => {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(null);
    onChange(undefined);
  };

  return (
    <Popover
      open={open && !disabled}
      onOpenChange={(isOpen) => !disabled && setOpen(isOpen)}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            `w-[250px] h-[40px] justify-start text-left font-normal text-xs lg:text-base relative ${className}`,
            !date && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#A7B6CD]" />
          {date ? format(date, "dd/MM/yyyy") : <span>{title}</span>}
          {date && !disabled && (
            <div
              onClick={handleClear}
              className="absolute right-2 hover:bg-gray-100 rounded-full p-1"
            >
              <X className="h-4 w-4 text-gray-500" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      {open && !disabled && (
        <CalendarPortal>
          <PopoverContent
            className="w-auto p-0"
            style={{
              position: "fixed",
              zIndex: 9999,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={(newDate: Date | undefined) => {
                if (newDate !== undefined) {
                  newDate?.setHours(0, 0, 0, 0);
                  setDate(newDate);
                  onChange(newDate);
                  setOpen(false);
                }
              }}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </CalendarPortal>
      )}
    </Popover>
  );
}
