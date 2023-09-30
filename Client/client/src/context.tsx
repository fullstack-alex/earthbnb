import { createContext } from "react";
import { UserProfile } from "./models/UserProfile";

export const ToastContext = createContext({ message: '', turnOnToast: (current:any) => {} });
export const NavigationContext = createContext({ page: '', setPage: (current:any) => {} });
export const UserContext = createContext({ user: {}, setUser: (current:UserProfile) => {} });
export const SelectedUserContext = createContext({ selectedUser: {}, setSelectedUser: (current:UserProfile) => {} });