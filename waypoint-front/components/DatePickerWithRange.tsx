"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // Tradução para PT-BR
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-12 text-base border-gray-200 hover:bg-gray-50 hover:text-gray-900",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
            {date?.from ? (
              date.to ? (
                <span className="text-gray-900">
                  {format(date.from, "dd 'de' MMM, yyyy", { locale: ptBR })} -{" "}
                  {format(date.to, "dd 'de' MMM, yyyy", { locale: ptBR })}
                </span>
              ) : (
                <span className="text-gray-900">
                  {format(date.from, "dd 'de' MMM, yyyy", { locale: ptBR })}
                </span>
              )
            ) : (
              <span className="text-gray-400">
                Selecione o período da viagem
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
