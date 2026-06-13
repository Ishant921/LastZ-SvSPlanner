export default function Toast({ toast }) {
  const bgClass = {
  success: "bg-green-500 text-white",
  danger: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
  default: "bg-white",
}[toast?.type || "default"];
  return (
    <div
      className={`absolute top-4 right-4 z-50 transition-all duration-300 ${
        toast
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8 pointer-events-none"
      }`}
    >
      <div
  className={`${bgClass} shadow-lg rounded-xl px-4 py-3 text-sm font-medium`}
>
        {toast?.message}
      </div>
    </div>
  );
}