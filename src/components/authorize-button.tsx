"use client";
import { Button } from "@/components/ui/button";
import { getAurinkoAuthorizationUrl } from "@/lib/aurinko";

export default function AuthorizeButton() {
  return (
    <div className="flex flex-col gap-2">
      <Button size="sm" variant={"outline"}>
        Sync Emails
      </Button>
      <Button
        size="sm"
        variant={"outline"}
        onClick={async () => {
          const url = await getAurinkoAuthorizationUrl("Google");
          window.location.href = url;
        }}
      >
        Authorize Email
      </Button>
    </div>
  );
}
