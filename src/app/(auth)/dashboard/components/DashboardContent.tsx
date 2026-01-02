// components/DashboardContent.tsx
import React from 'react';
import BrowseUsers from './views/BrowseUsers';
import MailingList from './views/MailingList';
// import SystemSettings from './views/SystemSettings';
// import UserManagement from './views/UserManagement';
// ... import other view components

interface DashboardContentProps {
  activeView: string;
}

const viewComponents: Record<string, React.ComponentType> = {
//   'System Settings': SystemSettings,
//   'User Managment': UserManagement,
  'System Settings': () => <div>System Settings</div>,
  'User Managment': () => <div>User Managment</div>,
  'Browse Users': BrowseUsers,
  'Mailing List': MailingList,
  'Cluster Managment': () => <div>Cluster Management</div>,
  'Financial Control': () => <div>Financial Control</div>,
  'Analitics': () => <div>Analytics</div>,
  'Security Logs': () => <div>Security Logs</div>,
  'Profile': () => <div>Profile</div>,
};

export default function DashboardContent({ activeView }: DashboardContentProps) {
  const ViewComponent = viewComponents[activeView];
  
  return ViewComponent ? <ViewComponent /> : <div>Select an option from the menu</div>;
}