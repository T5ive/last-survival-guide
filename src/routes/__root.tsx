import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "sonner";

export const Route = createRootRoute({
	component: () => (
		<LanguageProvider>
			<Header />
			<Outlet />
			<Toaster richColors  />
			<TanStackRouterDevtools />
		</LanguageProvider>
	),
});
