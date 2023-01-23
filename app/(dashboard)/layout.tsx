import GlassPane from "@/components/GlassPane";

export default function DashboardRootLayout({ children }) {
  return (
    <html>
      <head />
      <body className="h-screen w-screen bg-stone-700 p-6">
        <GlassPane className={"w-full h-full flex items-center justify-center"}>
          {children}
        </GlassPane>
      </body>
    </html>
  );
}
