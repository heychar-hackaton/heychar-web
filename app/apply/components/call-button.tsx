"use client"

import { ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { callInterview } from "@/actions/interviews"
import { SubmitButton } from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const CallButton = ({
    phone,
    interviewId,
}: {
    phone: string
    interviewId: string
}) => {
    const [data, dispatch] = useActionState(callInterview, {})
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    useEffect(() => {
        console.log(data)
        if (data.success === false) {
            toast.error(data.errors?.join(", ") ?? "Произошла ошибка", {
                position: "top-center",
            })
        } else if (data.success === true) {
            toast.success("Запрос на звонок отправлен успешно!", {
                position: "top-center",
                description: "Через несколько минут Вам поступит звонок",
            })
            setIsOpen(false)
            router.refresh()
        }
    }, [data, router])

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
                <Button
                    className="group h-auto gap-4 py-2 text-left"
                    variant="outline"
                >
                    <div className="space-y-1">
                        <h3 className="font-bold">Позвоните мне</h3>
                        <p className="whitespace-break-spaces font-normal text-muted-foreground">
                            Вам поступит звонок от HR-менеджера
                        </p>
                    </div>
                    <ChevronRightIcon
                        aria-hidden="true"
                        className="opacity-60 transition-transform group-hover:translate-x-0.5"
                        size={16}
                    />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form action={dispatch}>
                    <DialogHeader>
                        <DialogTitle>Номер для звонка</DialogTitle>
                        <DialogDescription>
                            Давайте сверим номер телефона для звонка
                        </DialogDescription>
                    </DialogHeader>
                    <input
                        name="interviewId"
                        type="hidden"
                        value={interviewId}
                    />
                    <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                            <Label className="sr-only" htmlFor="phone">
                                Номер телефона
                            </Label>
                            <Input
                                defaultValue={phone}
                                id="phone"
                                name="phone"
                                required
                                type="tel"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">
                                Отмена
                            </Button>
                        </DialogClose>
                        <SubmitButton>Позвонить</SubmitButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
