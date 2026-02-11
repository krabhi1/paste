import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface TagsInputProps {
  placeholder?: string;
  name?: string;
  maxTags?: number;
  defaultValue?: string[];
  value?: string[];
  onChange?: (tags: string[]) => void;
  error?: string;
  className?: string;
}

export function TagsInput({
  placeholder = "Add tags...",
  name,
  maxTags = 10,
  defaultValue = [],
  value,
  onChange,
  error,
  className,
}: TagsInputProps) {
  // Always maintain local state for instant feedback (Optimistic UI)
  const [tags, setTags] = React.useState<string[]>(value ?? defaultValue);

  // Sync with external value if it changes (e.g., from URL update)
  React.useEffect(() => {
    if (value !== undefined) {
      setTags(value);
    }
  }, [value]);

  const updateTags = (newTags: string[]) => {
    setTags(newTags); // Update locally immediately so the UI feels instant
    if (onChange) {
      onChange(newTags);
    }
  };
  const [pendingValue, setPendingValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = (val: string) => {
    const normalized = val
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    if (!normalized || tags.includes(normalized) || tags.length >= maxTags) {
      return;
    }

    updateTags([...tags, normalized]);
    setPendingValue("");
  };

  const removeTag = (index: number) => {
    updateTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag(pendingValue);
    } else if (
      e.key === "Backspace" &&
      pendingValue === "" &&
      tags.length > 0
    ) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Block invalid characters by filtering them out immediately
    const filtered = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setPendingValue(filtered);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const potentialTags = pastedText
      .split(/[,\s]+/)
      .map((t) =>
        t
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, ""),
      )
      .filter((t) => t.length >= 2);

    const newTags = [...tags];
    for (const t of potentialTags) {
      if (newTags.length >= maxTags) break;
      if (!newTags.includes(t)) {
        newTags.push(t);
      }
    }
    updateTags(newTags);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 px-3 py-1.5 min-h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 text-base md:text-sm transition-[color,box-shadow] outline-none",
          isFocused && "border-ring",
          error && "border-destructive",
          tags.length >= maxTags && "opacity-90",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 pl-2 pr-1 py-0.5 h-6 animate-in fade-in zoom-in-95 duration-200"
          >
            <span className="text-[11px] font-medium leading-none">{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="rounded-full outline-hidden hover:bg-muted-foreground/20 p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={pendingValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (pendingValue) addTag(pendingValue);
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className={cn(
            "flex-1 min-w-[80px] bg-transparent outline-hidden border-none p-0 text-sm placeholder:text-muted-foreground",
            tags.length >= maxTags && "hidden",
          )}
          disabled={tags.length >= maxTags}
        />
      </div>

      {/* Hidden input to store comma-separated tags for form submission */}
      {name && <input type="hidden" name={name} value={tags.join(",")} />}

      <div className="flex items-center justify-between px-1">
        {error ? (
          <p className="text-[11px] font-medium text-destructive">{error}</p>
        ) : (
          <p className="text-[10px] text-muted-foreground">
            {tags.length < maxTags
              ? "Separated by comma, space or enter"
              : "Max tags reached"}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground">
          {tags.length}/{maxTags}
        </p>
      </div>
    </div>
  );
}
