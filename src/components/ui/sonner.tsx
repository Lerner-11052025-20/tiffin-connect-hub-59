import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <style>{`
        [data-sonner-toast] {
          --toast-duration: 1500ms;
          overflow: hidden;
          position: relative;
        }
        [data-sonner-toast]::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          height: 3px;
          width: 100%;
          background: hsl(var(--primary));
          transform-origin: left;
          animation: toast-progress var(--toast-duration) linear forwards;
          z-index: 50;
        }
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        [data-sonner-toast] {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border-radius: 9999px !important;
        }
        [data-sonner-toast] [data-close-button] {
          top: 50% !important;
          transform: translateY(-50%) !important;
          right: 12px !important;
          left: auto !important;
          background: rgba(var(--background), 0.5) !important;
          backdrop-filter: blur(4px) !important;
          border: 1px solid rgba(var(--border), 0.5) !important;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        [data-sonner-toast] [data-close-button]:hover {
          opacity: 1;
        }
        [data-sonner-toast] [data-icon] {
          margin-right: 8px !important;
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        toastOptions={{
          duration: 1500,
          className: "rounded-full backdrop-blur-xl bg-white/70 dark:bg-black/80 border-white/20 dark:border-white/10 shadow-2xl px-6 py-4 flex items-center gap-2",
          style: {
            borderRadius: "9999px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          },
          classNames: {
            toast:
              "group toast group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground rounded-full",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-full",
          },
        }}
        closeButton={true}
        richColors={false}
        {...props}
      />
    </>
  );
};

export { Toaster, toast };



