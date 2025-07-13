import CallIcon from '@mui/icons-material/Call';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Outlet, useNavigate } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Call, Tag, Task, ManagementArea } from '@moveo/types';
import { ManagementAreaCtx } from './utils/ManagementAreaCtx';
import { NavigationItem } from '@toolpad/core';
import { getAllTags, getAllTasks, getCalls } from './services';
import { Add } from '@mui/icons-material';

export function App() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const initialArea =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/user')
    ? ManagementArea.User
    : ManagementArea.Admin;

const [managementArea, setManagementArea] = useState<ManagementArea>(initialArea);
  
useEffect(() => {
  loadData();
}, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [callsData, tagsData, tasksData] = await Promise.all([
        getCalls(),
        getAllTags(),
        getAllTasks()
      ]);
      setCalls(callsData);
      setTags(tagsData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigation: NavigationItem[] = useMemo(() => {
  if (managementArea === ManagementArea.User) {
    return [
      {
      kind: 'page',
      title: 'Create New Call',
      icon: <CallIcon />,
      action: <Add fontSize="small" />,
      segment: 'user/call/create',
      
      },
      { kind: 'header', title: 'Latest Calls' },
      ...calls.map((call) => ({
        kind: "page" as const,
        title: call.name,
        segment: `user/call/${call.id}`,
      })),
    ];
  }

  return [
    { kind: 'header', title: 'Admin' },
    {
      kind: 'page',
      title: 'Tags',
      icon: <LocalOfferIcon />,
      segment: 'admin/tags',
    },
  ];
}, [managementArea, calls]);

  const toggleManagementArea = useCallback((area: ManagementArea) => {
    setManagementArea(area);
    navigate(area === ManagementArea.Admin ? '/admin' : '/user');
  }, [navigate]);

  const createNewCall = useCallback((newCall: Call) => {
    setCalls((prev) => [newCall, ...prev]);
  }, []);

const managementContextValue = useMemo(
  () => ({
    tags,
    setTags,
    calls,
    setCalls,
    tasks,
    setTasks,
    managementArea,
    setManagementArea: toggleManagementArea,
    isLoading,
    setIsLoading,
    createNewCall,
  }),
  [
    tags,
    setTags,
    calls,
    setCalls,
    tasks,
    setTasks,
    managementArea,
    toggleManagementArea,
    isLoading,
    setIsLoading,
    createNewCall,
  ]
);

  return (
    <ManagementAreaCtx.Provider value={managementContextValue}>
      <ReactRouterAppProvider navigation={navigation}>
        <Outlet />
      </ReactRouterAppProvider>
    </ManagementAreaCtx.Provider>
  );
}