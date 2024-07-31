"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useAudio } from "@/lib/providers/AudioProvider";

const MobileNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { signOut } = useClerk();
  const { setAudio } = useAudio();

  const handleLogout = () => {
    setAudio(undefined);
    signOut(() => router.push("/"));
  };

  return (
    <section>
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer opacity-50 hover:opacity-100"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-1 md:hidden">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1 pb-10 pl-4"
          >
            <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
            <h1 className="text-24 font-extrabold  text-white-1 ml-2">
              Podcaster-AI
            </h1>
          </Link>
          <div className="flex h-[calc(100%-50px)] flex-col justify-between">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 text-white-1">
                {sidebarLinks.map(({ route, label, imgURL }) => {
                  const isActive =
                    pathname === route || pathname.startsWith(`${route}/`);

                  return (
                    <SheetClose asChild key={route}>
                      <Link
                        href={route}
                        className={cn(
                          "flex gap-3 items-center py-4 max-lg:px-4 justify-start",
                          {
                            "bg-nav-focus border-r-4 border-orange-1": isActive,
                            "hover:bg-nav-hover": !isActive,
                          }
                        )}
                      >
                        <Image
                          src={imgURL}
                          alt={label}
                          width={24}
                          height={24}
                        />
                        <p>{label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>

            <SignedOut>
              <div className="w-full pb-5">
                <Button
                  asChild
                  className="text-16 w-full bg-orange-1 font-extrabold"
                >
                  <Link
                    href="/sign-in"
                    className="flex gap-3 items-center py-4"
                  >
                    <Image
                      src="/icons/account.svg"
                      alt="sign-in"
                      width={24}
                      height={24}
                    />
                    <p className="text-white-1">Sign in</p>
                  </Link>
                </Button>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="w-full pb-5">
                <Button
                  className="text-16 w-full bg-orange-1 font-extrabold flex gap-3 items-center py-4"
                  onClick={handleLogout}
                >
                  <Image
                    src="/icons/logout.svg"
                    alt="logout"
                    width={24}
                    height={24}
                  />
                  <p className="text-white-1">Logout</p>
                </Button>
              </div>
            </SignedIn>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
