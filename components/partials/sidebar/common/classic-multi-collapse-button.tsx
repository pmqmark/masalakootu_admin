"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMobileMenuConfig } from "@/hooks/use-mobile-menu";
import Link from "next/link";

type Submenu = {
    id: string;
    title: string;
    path: string;
  };
  

interface CollapseMenuButtonProps {
  icon?: string;
  label: string;
  active: boolean;
  submenus: {
    id: string;
    href: string;
    label: string;
    active: boolean;
  }[];
}

export function MultiCollapseMenuButton({
  icon,
  label,
  active,
  submenus,
}: CollapseMenuButtonProps) {
  const pathname = usePathname();
  const router = useRouter(); // Use useRouter for navigation
  const isSubmenuActive = submenus?.some(
    (submenu) => submenu.active || pathname.startsWith(submenu.href)
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
  const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();

  return (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full mb-2 last:mb-0"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center group first:mt-3">
          <Button
            color="secondary"
            variant="ghost"
            className="w-full justify-start h-auto hover:bg-transparent capitalize text-sm font-normal md:px-5 px-5"
            fullWidth
          >
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center">
                <span
                  className={cn(
                    "h-1.5 w-1.5 me-3 rounded-full transition-all duration-150 ring-1 ring-default-600",
                    { "ring-4 bg-default ring-opacity-30 ring-default": active }
                  )}
                ></span>
                <p className="max-w-[150px] truncate">{label}</p>
              </div>
              <div
                className={cn(
                  "whitespace-nowrap inline-flex items-center justify-center rounded-full h-5 w-5 bg-menu-arrow text-menu-menu-foreground group-hover:bg-menu-arrow-active transition-all duration-300",
                  { "bg-menu-arrow-active": active }
                )}
              >
                <ChevronDown size={16} className="transition-transform duration-200" />
              </div>
            </div>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
  {submenus?.map(({ href, label, active }, index) => (
    <Button
      key={index}
      onClick={(e) => {
        e.stopPropagation();
        setMobileMenuConfig({ ...mobileMenuConfig, isOpen: false });
      }}
      color="secondary"
      variant="ghost"
      className="w-full justify-start h-auto mb-1.5 hover:bg-transparent first:mt-3 text-[13px] font-normal"
      asChild // ✅ This makes the Button behave as a Link without interfering with click events
    >
      <Link href={href}>
        <span
          className={cn(
            "h-1 w-1 me-3 rounded-full transition-all duration-150 bg-default-300 dark:bg-secondary ring-default-300",
            { "ring-4 bg-default ring-opacity-30 ring-default": active }
          )}
        ></span>
        <p className="max-w-[170px] truncate">{label}</p>
      </Link>
    </Button>
  ))}
</CollapsibleContent>

    </Collapsible>
  );
}
