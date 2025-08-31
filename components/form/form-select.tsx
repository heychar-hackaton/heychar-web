"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type SelectObject = {
  id: string
  name: string
}

type FormSelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  defaultSelectedId?: string
  getOptions: () => Promise<SelectObject[]>
}

export const FormSelect = (props: FormSelectProps) => {
  const [options, setOptions] = useState<SelectObject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOptions = async () => {
      const options = await props.getOptions()
      setOptions(options)
      setLoading(false)
    }
    fetchOptions()
  }, [])

  return (
    <Select {...props} disabled={loading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Загрузка..." : "Не выбрано"} />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
