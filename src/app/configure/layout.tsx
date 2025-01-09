import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Steps from "@/components/Steps";


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <MaxWidthWrapper className="flex flex-col flex-1 w-full">
            <Steps />
            {children}
        </MaxWidthWrapper>
    )
}
