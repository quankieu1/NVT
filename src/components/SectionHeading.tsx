import React from "react";

export function SeoulIvorySectionHeading({
  index,
  english,
  title,
  align = "left",
}: {
  index?: string | number;
  english?: string;
  title: string;
  align?: "left" | "center";
}) {
  const formattedIndex =
    index !== undefined && index !== ""
      ? String(index).padStart(2, "0")
      : undefined;

  if (align === "center") {
    return (
      <div data-reveal="true" className="mb-9 px-4 text-center sm:mb-12">
        {formattedIndex && (
          <p
            aria-hidden="true"
            className="si-display tabular-nums"
            style={{
              fontWeight: 500,
              lineHeight: 0.8,
              color: "var(--si-line)",
              fontSize: "clamp(2.8rem, 12vw, 4.6rem)",
            }}
          >
            {formattedIndex}
          </p>
        )}
        {english && (
          <p
            className="si-kr mt-1 mb-2.5 text-[0.74rem] text-(--si-accent) sm:text-[0.82rem]"
            style={{ letterSpacing: "0.24em" }}
          >
            {english}
          </p>
        )}
        <h2
          className="si-display m-0 font-medium text-(--si-ink)"
          style={{
            fontSize: "clamp(1.7rem, 6vw, 2.35rem)",
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </h2>
        <span aria-hidden="true" className="mt-4 flex justify-center">
          <span className="si-rule si-rule--foil si-draw si-draw--center w-12 sm:w-16" />
        </span>
      </div>
    );
  }

  return (
    <div data-reveal="true" className="mb-9 px-1 sm:mb-12">
      <div className="flex items-end gap-4 sm:gap-5">
        {formattedIndex && (
          <span
            aria-hidden="true"
            className="si-display shrink-0 tabular-nums"
            style={{
              fontWeight: 500,
              lineHeight: 0.8,
              color: "var(--si-line)",
              fontSize: "clamp(2.8rem, 12vw, 4.6rem)",
            }}
          >
            {formattedIndex}
          </span>
        )}
        <div className="min-w-0 shrink-0 pb-1.5">
          {english && (
            <p
              className="si-kr mb-1.5 text-[0.7rem] text-(--si-accent) sm:text-[0.78rem]"
              style={{ letterSpacing: "0.22em" }}
            >
              {english}
            </p>
          )}
          <h2
            className="si-display m-0 leading-none font-medium text-(--si-ink)"
            style={{
              fontSize: "clamp(1.7rem, 6vw, 2.35rem)",
              letterSpacing: "0.03em",
            }}
          >
            {title}
          </h2>
        </div>
        <span
          aria-hidden="true"
          className="si-rule--foil si-draw"
          style={{
            flex: "1 1 0%",
            minWidth: "1.5rem",
            height: 1,
            marginBottom: "0.6rem",
          }}
        />
      </div>
    </div>
  );
}

