import { Switch, Route, Router as WouterRouter } from "wouter";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import Calculator from "./pages/calculator";

  const queryClient = new QueryClient();

  function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <WouterRouter>
          <Switch>
            <Route path="/" component={Calculator} />
          </Switch>
        </WouterRouter>
      </QueryClientProvider>
    );
  }

  export default App;
  