import { Call, ManagementArea, Tag, Task } from "@moveo/types";
import { createContext } from "react";

interface IManagementAreaCtx {
    tags: Tag[]
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    calls: Call[]
    setCalls: React.Dispatch<React.SetStateAction<Call[]>>;
    createNewCall: (call: Call) => void;
    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    managementArea: ManagementArea;
    setManagementArea: (area: ManagementArea) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const ManagementAreaCtx = createContext<Partial<IManagementAreaCtx>>({
    tags: [],
    setTags: () => {},
    calls: [],
    setCalls: () => {},
    createNewCall: () => {},
    tasks: [],
    setTasks: () => {},
    managementArea: ManagementArea.Admin,
    setManagementArea: () => {},
    isLoading: false,
    setIsLoading: () => {}

});