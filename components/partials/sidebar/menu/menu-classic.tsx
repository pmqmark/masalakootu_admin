"use client";

import React from "react";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "@/components/navigation";
import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menus";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useConfig } from "@/hooks/use-config";
import MenuLabel from "../common/menu-label";
import MenuItem from "../common/menu-item";
import { CollapseMenuButton } from "../common/collapse-menu-button";
import MenuWidget from "../common/menu-widget";
import SearchBar from "@/components/partials/sidebar/common/search-bar";
import TeamSwitcher from "../common/team-switcher";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getLangDir } from "rtl-detect";
import Logo from "@/components/logo";
import SidebarHoverToggle from "@/components/partials/sidebar/sidebar-hover-toggle";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";

export function MenuClassic() {
  // Translate
  const t = useTranslations("Menu");
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const direction = getLangDir(params?.locale ?? "");

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const menuList = getMenuList(pathname, t);
  const [config, setConfig] = useConfig();
  const collapsed = config.collapsed;
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;

  const scrollableNodeRef = React.useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current?.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    const node = scrollableNodeRef.current;
    node?.addEventListener("scroll", handleScroll);

    return () => {
      node?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isDesktop && (
        <div className="flex items-center justify-between px-4 py-4">
          <Logo />
          <SidebarHoverToggle />
        </div>
      )}

      <ScrollArea className="[&>div>div[style]]:!block" dir={direction}>
        {isDesktop && (
          <div
            className={cn("space-y-3 mt-6 ", {
              "px-4": !collapsed || hovered,
              "text-center": collapsed || !hovered,
            })}
          >
            <TeamSwitcher />
            <SearchBar />
          </div>
        )}

        <nav className="mt-8 h-full w-full">
          <ul className="h-full flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-4">
            {menuList?.map(({ groupLabel, menus }, index) => (
              <li className="w-full" key={index}>
                {/* Group Label */}
                {groupLabel &&
  ((!collapsed || hovered) ? (
    <MenuLabel label={groupLabel} />
  ) : (
    null
  ))}

              {/* Menu Items */}
{menus.map(({ href, label, icon, active, id, children }) => (
  <li className="w-full mb-2 flex items-center" key={id}>
    {children ? (
      <CollapseMenuButton
        icon={icon}
        label={label}
        active={active}
        submenus={children}
        id={id}
        showDropdownIcon={true} // Ensure dropdown icon is shown
      />
    ) : (
      <MenuItem href={href} icon={icon} label={label} active={active} />
    )}
  </li>
))}

              </li>
            ))}

            {/* Menu Widget */}
            {!collapsed && (
              <li className="w-full grow  flex items-end">
                <MenuWidget />
              </li>
            )}
          </ul>
        </nav>
      </ScrollArea>
    </>
  );
}
