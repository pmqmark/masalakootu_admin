"use client";
import React, { useState } from "react";
import { Link, usePathname } from "@/components/navigation";
import { ChevronDown, LucideIcon, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";

interface SubmenuItem {
  href: string;
  label: string;
  active?: boolean;
  children?: SubmenuItem[];
  icon?: LucideIcon;
}

interface CollapseMenuButtonProps {
  label: string;
  href?: string;
  id: string;
  submenus?: SubmenuItem[];
  icon?: LucideIcon;
  active?: boolean;
}

export function CollapseMenuButton({
  label,
  href,
  id,
  submenus = [],
  icon,
  active = false,
}: CollapseMenuButtonProps) {
  const pathname = usePathname();
  const isSubmenuActive = submenus?.some(
    (submenu) => submenu.active || pathname.startsWith(submenu.href)
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return submenus.length > 0 ? (
    <Collapsible  onOpenChange={setIsCollapsed}>
      <CollapsibleTrigger asChild>
        <div className="flex flex-row">
  <div
    variant={active ? "default" : "ghost"}
    className="flex items-center justify-between w-full text-default  font-semibold rounded-md"
  >
    <div className="flex items-center gap-2 px-3">
      <ShoppingCart/>
      <span>{label}</span>
    </div>
    {submenus.length > 0 && <ChevronDown className="h-5 w-5" />} {/* Dropdown Icon */}
  </div>
  </div>
</CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden rounded-md w-full bg-gray-500">
        {submenus.map(({ href, label, active, icon }, index) => (
          <Link key={index} href={href} className="block">
            <Button
              variant={active ? "default" : "ghost"}
              className="flex items-center gap-2 w-full py-2 px-6 text-white text-sm"
            >
              {icon && React.createElement(icon, { className: "h-4 w-4" })}
              {label}
            </Button>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={active ? "default" : "ghost"}
                className="w-full bg-gray-600 justify-center"
                size="icon"
              >
                {icon && React.createElement(icon, { className: "h-5 w-5" })}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent
        side="right"
        sideOffset={20}
        align="start"
        className="border-sidebar space-y-1.5"
      >
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-default-300" />
        <DropdownMenuGroup>
          {submenus.map(({ href, label, active, children }, index) =>
            !children || children.length === 0 ? (
              <DropdownMenuItem
                key={index}
                asChild
                className={cn("focus:bg-secondary", {
                  "bg-secondary text-secondary-foreground": active,
                })}
              >
                <Link className="cursor-pointer flex gap-3" href={href}>
                  <p className="max-w-[180px] truncate">{label}</p>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {children.map(({ href, label }, subIndex) => (
                      <DropdownMenuItem key={subIndex} asChild>
                        <Link href={href} className="cursor-pointer flex gap-3">
                          {label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
