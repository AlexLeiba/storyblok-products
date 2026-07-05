import ContainerWrapper from "@/components/ContainerWrapper/ContainerWrapper";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <Header isPublic={false} />
      <main className="flex-1 h-full mt-[48px]">
        <ContainerWrapper>{children}</ContainerWrapper>
      </main>
      <Footer />
    </div>
  );
}
