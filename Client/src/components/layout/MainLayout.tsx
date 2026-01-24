import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setUser, fetchCurrentUser } from "@/redux/slices/authSlice";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { sidebarCollapsed } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Verify token and fetch current user from server
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => {
          // Token is invalid, redirect to login
          navigate("/login");
        });
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [dispatch, navigate, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <TopNavbar />
        <main className="flex-1 overflow-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
