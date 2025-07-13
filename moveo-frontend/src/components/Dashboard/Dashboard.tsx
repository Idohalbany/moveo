import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { ManagementArea } from '@moveo/types';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import { useCallback, useContext } from 'react';
import { ManagementAreaCtx } from '../../utils/ManagementAreaCtx';
import css from './Dashboard.module.scss'

export function Dashboard() {
  const { managementArea, setManagementArea } = useContext(ManagementAreaCtx);

  const handleToggleArea = useCallback(() => {
    setManagementArea?.(managementArea === ManagementArea.Admin ? ManagementArea.User : ManagementArea.Admin);
  }, [managementArea, setManagementArea]);

  function CustomAppTitle() {
    return (
      <div className={css.appTitle}>
        <CloudCircleIcon fontSize="large" className={css.icon} />
        <span className={css.titleText}>Call Center</span>
      </div>
    );
  }

function ToolbarActionsToggle() {
  return (
    <button className={css.toggleButton} onClick={handleToggleArea}>
      {managementArea === ManagementArea.Admin ? 'User' : 'Admin'} Area
    </button>
  );
}

  return (
    <DashboardLayout
      hideNavigation={managementArea === ManagementArea.Admin}
      slots={{
        appTitle: CustomAppTitle,
        toolbarActions: ToolbarActionsToggle,
      }}
    >
      <Outlet />
    </DashboardLayout>
  );
}
