"use client";

import { useSidebar } from "@/components/ui/sidebar"
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  items?: { title: string; href: string }[];
}

const menuByRole: Record<string, MenuItem[]> = {
  admin: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },

    {
      title: "Pengajuan",
      icon: FileText,
      items: [
        { title: "Petty Cash", href: "/petty-cash" },
        { title: "Loan", href: "/loan" },
      ],
    },

    {
      title: "Laporan",
      icon: BarChart3,
      items: [
        { title: "Laporan Petty Cash", href: "/reports/petty-cash" },
        { title: "Laporan Loan", href: "/reports/loan" },
        { title: "Angsuran Loan", href: "/reports/installments" },
      ],
    },

    {
      title: "Anggota",
      icon: Users,
      items: [
        { title: "Pendaftaran Anggota", href: "/members/register" },
        { title: "Daftar Anggota", href: "/members" },
      ],
    },
{
  title: "Master Data",
  icon: Settings,
  items: [
    { title: "Master Loan", href: "/master/loan" },
  ],
},
    {
      title: "Approver",
      icon: UserCheck,
      items: [
        { title: "HRD", href: "/approver/hrd" },
        { title: "Manager", href: "/approver/manager" },
        { title: "Direktur", href: "/approver/director" },
        { title: "Finance", href: "/approver/finance" },
      ],
    },
  ],

  pegawai: [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },

  {
    title: "Pengajuan",
    icon: FileText,
    items: [
      { title: "Petty Cash", href: "/petty-cash" },
      { title: "Loan", href: "/loan" },
    ],
  },

  {
    title: "Laporan",
    icon: BarChart3,
    items: [
      { title: "Laporan Petty Cash", href: "/reports/petty-cash" },
      { title: "Laporan Loan", href: "/reports/loan" },
      { title: "Angsuran Loan", href: "/reports/installments" },
    ],
  },
  ],

  hrd: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      title: "Approval",
      icon: UserCheck,
      items: [{ title: "HRD", href: "/approver/hrd" }],
    },
  ],

  manager: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      title: "Approval",
      icon: UserCheck,
      items: [{ title: "Manager", href: "/approver/manager" }],
    },
  ],

  direktur: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      title: "Approval",
      icon: UserCheck,
      items: [{ title: "Direktur", href: "/approver/director" }],
    },
  ],

  finance: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      title: "Approval",
      icon: Wallet,
      items: [{ title: "Finance", href: "/approver/finance" }],
    },
    {
      title: "Laporan",
      icon: BarChart3,
      items: [
        { title: "Laporan Petty Cash", href: "/reports/petty-cash" },
        { title: "Laporan Loan", href: "/reports/loan" },
        { title: "Angsuran Loan", href: "/reports/installments" },
      ],
    },
  ],
};


export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === "collapsed" 
  const pathname = usePathname();
  const [role, setRole] = useState<string>("pegawai");
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  useEffect(() => {
    const savedRole = localStorage.getItem("role") || "pegawai";
    setRole(savedRole);
  }, []);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isChildActive = (items?: { href: string }[]) =>
    items?.some((item) => pathname === item.href);

  const menuItems = menuByRole[role] || [];

  return (
    <Sidebar
  className={cn(
    "flex-shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl transition-all duration-300",
    collapsed ? "w-[70px]" : "w-[260px]"
  )}
>
      
      {/* HEADER */}
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            {!collapsed && (
  <p className="text-sm font-semibold">CashFlow</p>
)}
            {!collapsed && (
  <p className="text-xs text-sidebar-foreground/60">
    Management System
  </p>
)}
          </div>
        </Link>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          {!collapsed && (
  <SidebarGroupLabel className="text-xs uppercase text-sidebar-foreground/60 px-3 mb-2">
    Menu
  </SidebarGroupLabel>
)}

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.href) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
  asChild
  className={cn(
    "text-sidebar-foreground/70",
    "transition-all duration-300 ease-out",
    "hover:bg-sidebar-accent hover:text-sidebar-foreground",
    "hover:translate-x-1 hover:scale-[1.02]",
    collapsed && "justify-center",

    isActive(item.href) &&
  "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-[0_0_10px_rgba(99,102,241,0.4)] relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:rounded-r before:bg-primary"
  )}
>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <Collapsible
                    key={item.title}
                    open={openMenus.includes(item.title)}
                    onOpenChange={() => toggleMenu(item.title)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
  className={cn(
    "text-sidebar-foreground/70",
    "transition-all duration-300 ease-out",
    "hover:bg-sidebar-accent hover:text-sidebar-foreground",
    "hover:translate-x-1 hover:scale-[1.02]",

    isChildActive(item.items) &&
      "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
  )}
>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                          <ChevronDown
  className={cn(
    "ml-auto h-4 w-4 transition-transform duration-300",
    openMenus.includes(item.title) ? "rotate-180" : "rotate-0"
  )}
/>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      {!collapsed && (
  <CollapsibleContent
    className={cn(
      "overflow-hidden transition-all duration-300",
      "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-1",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-1"
    )}
  >
    <SidebarMenuSub className="ml-4 border-l border-sidebar-border pl-2 space-y-1">
      {item.items?.map((sub) => (
        <SidebarMenuSubItem key={sub.href}>
          <SidebarMenuSubButton
            asChild
            className={cn(
              "text-sidebar-foreground/60",
              "transition-all duration-300 ease-out",
              "hover:text-sidebar-foreground hover:bg-sidebar-accent",
              "hover:translate-x-1",

              isActive(sub.href) &&
                "text-sidebar-primary-foreground bg-sidebar-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-r before:bg-primary"
            )}
          >
            <Link href={sub.href}>
              {!collapsed && sub.title}
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  </CollapsibleContent>
)}
      </SidebarMenuItem>
    </Collapsible>
  );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                localStorage.removeItem("role");
                window.location.href = "/login";
              }}
              className="text-red-400 hover:bg-red-500/20 hover:text-white transition"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}