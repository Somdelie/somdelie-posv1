"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  return h * 60 + m;
}

function fromMinutes(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad(h)}:${pad(m)}`;
}

export type TimePickerProps = {
  value?: string | null;
  onChangeAction: (value: string) => void;
  minuteStep?: number;
  start?: string; // "HH:mm"
  end?: string; // "HH:mm"
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function TimePicker({
  value,
  onChangeAction,
  minuteStep = 15,
  start = "00:00",
  end = "23:45",
  placeholder = "Select time",
  className,
  disabled,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const times = React.useMemo(() => {
    const out: string[] = [];
    let cur = toMinutes(start);
    const max = toMinutes(end);
    for (; cur <= max; cur += minuteStep) {
      out.push(fromMinutes(cur));
    }
    return out;
  }, [start, end, minuteStep]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <span className="inline-flex items-center gap-2">
            <Clock className="opacity-70" size={16} />
            {value ? value : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[250px]" align="start">
        <Command>
          <CommandInput placeholder="Search time..." />
          <CommandList>
            <CommandEmpty>No times found.</CommandEmpty>
            <CommandGroup>
              {times.map((t) => (
                <CommandItem
                  key={t}
                  value={t}
                  onSelect={() => {
                    onChangeAction(t);
                    setOpen(false);
                  }}
                >
                  {t}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default TimePicker;
