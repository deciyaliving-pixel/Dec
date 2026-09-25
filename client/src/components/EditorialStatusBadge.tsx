import { editorialStatusMessage } from "@staykhoj/shared";
import { formatDateShort } from "../lib/format";

interface Props {
  reportingStatus: "planning_draft" | "verified_firsthand";
  hasTimeSensitiveInfo?: boolean;
  lastCheckedDate?: string;
  isSeedContent?: boolean;
}

export function EditorialStatusBadge({ reportingStatus, hasTimeSensitiveInfo, lastCheckedDate, isSeedContent }: Props) {
  const planningMessage = editorialStatusMessage(reportingStatus);

  if (!planningMessage && !hasTimeSensitiveInfo && !isSeedContent) return null;

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {planningMessage && (
        <span className="dashed-block inline-flex items-center gap-1.5 bg-ochre/10 px-2.5 py-1 font-medium text-ochre-dark">
          <span aria-hidden>&#9998;</span> {planningMessage}
        </span>
      )}
      {hasTimeSensitiveInfo && lastCheckedDate && (
        <span className="inline-flex items-center gap-1.5 rounded-card border border-ink/20 bg-paper px-2.5 py-1 text-ink-500">
          Last checked {formatDateShort(lastCheckedDate)}
        </span>
      )}
      {isSeedContent && (
        <span className="inline-flex items-center gap-1.5 rounded-card border border-sage/50 bg-sage/10 px-2.5 py-1 font-medium text-sage-dark">
          Sample content
        </span>
      )}
    </div>
  );
}
