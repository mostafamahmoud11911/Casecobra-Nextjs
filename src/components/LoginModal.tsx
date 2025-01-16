"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs"
import Image from "next/image"
import React from 'react'
import { buttonVariants } from "./ui/button"

interface LoginModalProps {
    isLoginModal: boolean
    setIsLoginModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LoginModal({ isLoginModal, setIsLoginModal }: LoginModalProps) {
    return (
        <>
            <Dialog open={isLoginModal} onOpenChange={setIsLoginModal}>
                <DialogContent className="absolute z-[999999]">
                    <DialogHeader>
                        <div className="relative mx-auto w-24 h-24 mb-2">
                            <Image src="/images/snake-1.png" fill className="object-contain" alt="" />
                        </div>
                        <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">Log in to continue</DialogTitle>
                        <DialogDescription className="text-center text-base py-2">
                            <span className="font-medium text-zinc-900">Your configuration is saved!</span>{' '}
                            Please login or create an account to complete your purchase.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
                        <LoginLink className={buttonVariants({
                            variant: "outline"
                        })}>Login</LoginLink>
                        <RegisterLink className={buttonVariants({
                            variant: "default"
                        })}>
                            Register
                        </RegisterLink>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
