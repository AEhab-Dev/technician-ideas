
  "use client";

  import { useState, useRef, useId } from "react";

  interface TooltipProps {
    content: string;
    children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    position?: "top" | "bottom" | "left" | "right";
  }

  export default function Tooltip({
    content,
    children,
    position = "top",
  }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const tooltipId = useId();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setVisible(true);};

    const hide = () => {
      timeoutRef.current = setTimeout(() => setVisible(false), 100);
    };

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
    <span
        className="relative block w-full h-full"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {/* Clone child to inject aria-describedby */}
        {Object.assign({}, children, {
          props: {
            ...children.props,
            "aria-describedby": visible ? tooltipId : undefined,
          },
        })}

        {/* Tooltip bubble */}
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1.5 text-xs font-sans font-medium text-brand-white bg-background-elevated border border-border rounded-md shadow-card whitespace-nowrap 
  pointer-events-none transition-all duration-150 ${
            positionClasses[position]
          } ${
            visible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"}`}
        >
          {content}
          {/* Arrow */}
          <span
            className={`absolute w-1.5 h-1.5 bg-background-elevated border-border rotate-45 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-r border-b"
                : position === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-l border-t"
                : position === "left"
                ? "left-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-t border-r"
                : "right-full top-1/2 -translate-y-1/2 translate-x-1/2 border-b border-l"
            }`}
            aria-hidden="true"
          />
        </span>
      </span>
    );
  }