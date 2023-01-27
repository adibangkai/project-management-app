import "@/styles/global.css";
import GlassPane from "@/components/GlassPane";
import Sidebar from "@/components/Sidebar";

export default function DashboardRootLayout({ children }) {
  return (
    <html>
      <head />
      <body className="h-screen w-screen bg-sky-600 p-6">
        <GlassPane className={"w-full h-full flex items-center justify-center"}>
          <Sidebar />
          {children}
        </GlassPane>
      </body>
    </html>
  );
}
