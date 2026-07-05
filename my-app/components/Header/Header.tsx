import Link from "next/link";
import ContainerWrapper from "../ContainerWrapper/ContainerWrapper";
import Signout from "./SignOutForm";

export default function Header({ isPublic = true }: { isPublic: boolean }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-2 bg-gray-500">
      <ContainerWrapper className="flex justify-between items-center">
        <Link href="/" className="text-white">
          <h1 className="font-bold">Storyblok</h1>
        </Link>

        <nav className="flex items-center gap-4">
          {isPublic ? (
            <>
              <Link href="/signin" className="text-white">
                Sign in
              </Link>
              <Link href="/signup" className="text-white">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/products" className="text-white">
                Products
              </Link>
              <Link href="/dashboard/cart" className="text-white">
                Cart
              </Link>
              <Signout />
            </>
          )}
        </nav>
      </ContainerWrapper>
    </header>
  );
}
