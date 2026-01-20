import * as React from "react";

import { cn } from "@/utils/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-[#0088CC] focus-visible:ring-[#0088CC]/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 bg-input-background flex field-sizing-content min-h-16 w-full resize-none rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
