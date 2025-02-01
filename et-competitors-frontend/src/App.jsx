import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import CompanyDetails from "./Pages/CompanyDetails/CompanyDetails";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Posts from "./Pages/Posts/Posts";
import { Toaster } from "react-hot-toast";
import CompanyPosts from "./Pages/CompanyDetails/Components/CompanyPosts";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="company-details/:id" element={<CompanyDetails />}>
              <Route path="posts" element={<CompanyPosts />} />
            </Route>
            <Route path="posts" element={<Posts />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="flex h-screen items-center justify-center text-3xl bg-slate-200">
                Page Not Found
              </div>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
      <ReactQueryDevtools />  
    </QueryClientProvider>
  );
}

export default App;
