import ContainerWrapper from "@/components/ContainerWrapper/ContainerWrapper";
import Header from "@/components/Header/Header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full">
      <Header isPublic />
      <main className="flex-1 mt-[48px]">
        <ContainerWrapper className="flex flex-col justify-center items-center h-full">
          {children}
        </ContainerWrapper>
      </main>
    </div>
  );
}
