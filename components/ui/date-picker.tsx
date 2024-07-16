// Import necessary dependencies and components
import * as React from "react";
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
}

// DatePicker component
export function DatePicker({ onChange, value }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  // const localeLanguage = lang === "en" ? enUS : ptBR;
  // const formatDate = lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy";
  // const label = lang === "en" ? "Pick a date" : "Selecione uma data";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[300px] h-[40px] justify-start text-left font-normal text-xs lg:text-base",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "dd/MM/yyyy")
          ) : (
            <span>{"Selecione uma data"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(newDate: Date | undefined) => {
            if (newDate !== undefined) {
              newDate?.setHours(0, 0, 0, 0);
              setDate(newDate);
              onChange(newDate);
            }
          }}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
