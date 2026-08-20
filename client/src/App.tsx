import { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "@/routes";
import { useAuthStore } from "@/store/authStore";
import { refreshRequest } from "@/features/auth/auth.api";

const queryClient = new QueryClient();

function AppRoutes() {
  return useRoutes(routes);
}

function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const finishBootstrap = useAuthStore((s) => s.finishBootstrap);

  useEffect(() => {
    refreshRequest()
      .then((data) => setAuth(data.user, data.accessToken))
      .catch(() => {
        // No valid refresh cookie — user simply isn't logged in. Not an error.
      })
      .finally(() => finishBootstrap());
  }, [setAuth, finishBootstrap]);

  return <>{children}</>;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionBootstrap>
          <AppRoutes />
        </SessionBootstrap>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;