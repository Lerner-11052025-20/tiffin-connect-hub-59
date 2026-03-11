import { useEffect, useRef } from "react";
import { useInView, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NumberTicker({
    value,
    direction = "up",
    delay = 0,
    className,
    prefix = "",
    suffix = "",
}: {
    value: number;
    direction?: "up" | "down";
    className?: string;
    delay?: number;
    prefix?: string;
    suffix?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useSpring(direction === "down" ? value : 0, {
        damping: 60,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(direction === "down" ? 0 : value);
            }, delay * 1000);
        }
    }, [motionValue, isInView, delay, value, direction]);

    useEffect(
        () =>
            motionValue.on("change", (latest) => {
                if (ref.current) {
                    ref.current.textContent = Intl.NumberFormat("en-IN").format(
                        Number(latest.toFixed(0)),
                    );
                }
            }),
        [motionValue]
    );

    return (
        <span className={cn("inline-block tabular-nums tracking-wider", className)}>
            {prefix}
            <span ref={ref}>
                {Intl.NumberFormat("en-IN").format(direction === "down" ? value : 0)}
            </span>
            {suffix}
        </span>
    );
}
