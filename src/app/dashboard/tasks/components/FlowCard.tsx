"use client";

export function FlowCard({
                             id,
                             title,
                             description,
                             priority,
                             progress,
                             due,
                             onClick,
                             onHover,
                         }) {

    const priorityColors = {
        LOW: {
            border: "border-blue-300",
            badge: "bg-blue-100 text-blue-700",
            bar: "bg-blue-500",
        },
        MEDIUM: {
            border: "border-yellow-300",
            badge: "bg-yellow-100 text-yellow-700",
            bar: "bg-yellow-500",
        },
        HIGH: {
            border: "border-orange-300",
            badge: "bg-orange-100 text-orange-700",
            bar: "bg-orange-500",
        },
        URGENT: {
            border: "border-red-300",
            badge: "bg-red-100 text-red-700",
            bar: "bg-red-500",
        },
    };

    const palette = priorityColors[priority] || priorityColors.LOW;

    return (
        <div
            onClick={onClick}
            className={`
    w-full
    rounded-xl p-4 cursor-pointer select-none
    shadow-[0_8px_20px_rgba(0,0,0,0.08)]
    hover:shadow-[0_16px_32px_rgba(0,0,0,0.15)]
    hover:-translate-y-[4px]
    transition-all duration-300 ease-out
    bg-white border ${palette.border}
  `}
            style={{minHeight: "150px"}}
        >

            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-sm mb-2">
                {title}
            </h3>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
                <div
                    className={`h-full ${palette.bar} rounded-full`}
                    style={{width: `${progress}%`}}
                />
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                {description}
            </p>

            {/* Footer */}
            <div className="flex items-center text-xs text-gray-600">
        <span className={`px-2 py-1 rounded-md mr-2 ${palette.badge}`}>
          {priority}
        </span>

                <span className="ml-auto">{due}</span>
            </div>
        </div>
    );
}
