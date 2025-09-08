import type { Metadata } from "next"
import { getProviders } from "@/actions/providers"
import { EmptyProvidersState } from "./components/empty-state"
import { ProviderList } from "./components/list"

export const metadata: Metadata = {
    title: "Провайдеры",
}

export default async function Page() {
    const providers = await getProviders()

    if (!providers.length) {
        return <EmptyProvidersState />
    }

    return <ProviderList providers={providers} />
}
