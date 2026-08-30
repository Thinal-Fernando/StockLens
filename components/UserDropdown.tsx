"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/actions/auth.actions";

// The observer's mark. A survey sheet is signed by whoever took the soundings
const UserDropdown = ({ user }: { user: User }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const initial = (user.name?.charAt(0) || "?").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={`Account: ${user.name}`}
            className="flex items-center gap-2.5 px-1.5 py-1.5 transition-colors hover:bg-shoal-1/60 focus:outline-none focus-visible:outline-1 focus-visible:outline-caution"
          />
        }
      >
        <span
          data-figure=""
          className="flex size-7 shrink-0 items-center justify-center border border-ink text-[0.8125rem] leading-none text-ink"
        >
          {initial}
        </span>
        <span className="apparatus hidden max-w-36 truncate text-ink sm:block">
          {user.name}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-auto min-w-60 max-w-[calc(100vw-1rem)] border border-rule-strong bg-paper-raised p-0"
      >
        <div className="border-b border-rule px-4 py-3">
          <p className="apparatus mb-1">Account</p>
          <p className="font-text text-[0.9375rem] leading-tight text-ink">
            {user.name}
          </p>
          <p className="mt-0.5 break-all font-text text-[0.8125rem] italic leading-tight text-ink-2">
            {user.email}
          </p>
        </div>

        <DropdownMenuSeparator className="m-0 h-0" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer px-4 py-3 transition-colors focus:bg-caution-tint focus:text-caution"
        >
          <span className="apparatus text-current">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
