import { IconAlarm } from "@douyinfe/semi-icons";

const navigation = [
  { name: "Dashboard", href: "#", icon: IconAlarm, current: true, count: "5" },
  { name: "Team", href: "#", icon: IconAlarm, current: false },
  {
    name: "Projects",
    href: "#",
    icon: IconAlarm,
    current: false,
    count: "19",
  },
  {
    name: "Calendar",
    href: "#",
    icon: IconAlarm,
    current: false,
    count: "20+",
  },
  { name: "Documents", href: "#", icon: IconAlarm, current: false },
  { name: "Reports", href: "#", icon: IconAlarm, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <nav className="space-y-1" aria-label="Sidebar">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={classNames(
            item.current
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          )}
          aria-current={item.current ? "page" : undefined}
        >
          <item.icon
            className={classNames(
              item.current
                ? "text-gray-500"
                : "text-gray-400 group-hover:text-gray-500",
              "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
            )}
            aria-hidden="true"
          />
          <span className="truncate">{item.name}</span>
          {item.count ? (
            <span
              className={classNames(
                item.current
                  ? "bg-white"
                  : "bg-gray-100 group-hover:bg-gray-200",
                "ml-auto inline-block py-0.5 px-3 text-xs rounded-full"
              )}
            >
              {item.count}
            </span>
          ) : null}
        </a>
      ))}
    </nav>
  );
}
