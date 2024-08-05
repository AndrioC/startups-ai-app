import * as React from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

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
  value: Date | undefined;
  title?: string;
  className?: string;
}

export function DatePicker({
  onChange,
  value,
  title = "Selecione uma data",
  className,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const CalendarPortal = ({ children }: { children: React.ReactNode }) => {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            `w-[250px] h-[40px] justify-start text-left font-normal text-xs lg:text-base ${className}`,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#A7B6CD]" />
          {date ? format(date, "dd/MM/yyyy") : <span>{title}</span>}
        </Button>
      </PopoverTrigger>
      {open && (
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
