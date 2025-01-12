import { cookies } from "next/headers";
import { Mail } from "./components/mail";

export default async function MailPage() {
  const layoutCookie = await cookies();
  const layout = layoutCookie.get("react-resizable-panels:layout:mail");
  const collapsedCookie = await cookies();
  const collapsed = collapsedCookie.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <div className="md:hidden"></div>
      <div className="hidden h-screen flex-col overflow-scroll md:flex">
        <Mail
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
