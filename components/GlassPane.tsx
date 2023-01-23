import clsx from "clsx";
import "@/styles/global.css";
export default function GlassPane({ children, className }) {
  return (
    <div
      className={clsx(
        "glass rounded-2xl border-solid border-2 border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
}
