import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
    RegisterLink,
    LoginLink,
    LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/components";

export default async function Navbar() {
    const {getUser} = await getKindeServerSession();
    const user = await getUser();
    const isAdmin = user?.email === process.env.ADMIN_EMAIL;



    return (
        <nav className="sticky z-[100] top-0 h-14 inset-x-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-md transition-all">

            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href="/" className="flex z-40 font-semibold">
                        case <span className="text-green-600">cobra</span>
                    </Link>

                    <div className="h-full space-x-4 flex items-center">
                        {user ? (
                            <>
                                <LogoutLink className={buttonVariants({ size: "sm", variant: "ghost" })}>Sign out</LogoutLink>
                                {isAdmin ? <Link href="/dashboard" className={buttonVariants({ size: "sm", variant: "ghost" })}>Dashboard</Link> : <></>}
                                <Link href="/configure/upload" className={buttonVariants({ size: "sm", className: "hidden sm:flex items-center gap-1" })}>Create case <ArrowRight className="w-5 h-5 ml-1.5" /></Link>
                            </>
                        ) : (
                            <>
                                <RegisterLink className={buttonVariants({ size: "sm", variant: "ghost" })}>Sign up</RegisterLink>
                                <LoginLink href="/api/auth/login" className={buttonVariants({ size: "sm" })}>Sign in</LoginLink>
                                <div className="h-8 w-px bg-zinc-200 hidden sm:block " />
                                <Link href="/configure/upload" className={buttonVariants({ size: "sm", className: "hidden sm:flex items-center gap-1" })}>Create case <ArrowRight className="w-5 h-5 ml-1.5" /></Link>
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>



        </nav>
    )
}
