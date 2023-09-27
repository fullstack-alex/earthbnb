import { createContext } from "react";

export const ToastContext = createContext({ message: '', turnOnToast: (current:any) => {} });
export const NavigationContext = createContext({ page: '', setPage: (current:any) => {} });
export const UserContext = createContext({ user: {}, setUser: (current:any) => {} });