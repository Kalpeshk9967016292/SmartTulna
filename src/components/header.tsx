"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { LogOut, Menu, Settings, Blocks, User as UserIcon } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <Blocks className="h-4 w-4" /> },
  { href: "/compare", label: "Compare", icon: <Settings className="h-4 w-4" /> },
];

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>

        {/* Mobile Nav */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-0">
            <div className="flex h-full flex-col">
              <SheetHeader className="border-b p-4 text-left">
                <SheetTitle>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo />
                    </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 p-4">
                <NavLinks mobile onLinkClick={() => setIsMobileMenuOpen(false)} />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} data-ai-hint="user avatar" />
                  <AvatarFallback>{user?.displayName?.charAt(0) || <UserIcon />}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}


function NavLinks({ mobile = false, onLinkClick }: { mobile?: boolean, onLinkClick?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {navLinks.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onLinkClick}
          className={cn(
            "transition-colors hover:text-primary",
            pathname === href ? "text-primary font-semibold" : "text-muted-foreground",
            mobile && "flex items-center gap-2 text-base p-2 rounded-md hover:bg-accent"
          )}
        >
          {mobile && icon}
          {label}
        </Link>
      ))}
    </>
  );
}
