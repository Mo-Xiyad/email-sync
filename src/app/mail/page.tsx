"use client";
import dynamic from "next/dynamic";

const Mail = dynamic(
  () => import("./components/mail").then((mod) => mod.Mail),
  {
    ssr: false,
  },
);
function page() {
  return (
    <div className="hidden h-screen flex-col overflow-scroll md:flex">
      <Mail
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </div>
  );
}

export default page;
