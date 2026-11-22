import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import AmbientOrbs from './components/AmbientOrbs';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomeView from './components/views/HomeView';
import FinanceView from './components/views/FinanceView';
import AcademicView from './components/views/AcademicView';
import AccountsView from './components/views/AccountsView';
import SettingsView from './components/views/SettingsView';
import ModalManager from './components/modals/ModalManager';
import Toast from './components/Toast';
import CalendarDrawer from './components/CalendarDrawer';

function DashboardContent() {
  const { activeView } = useDashboard();

  return (
    <>
      <AmbientOrbs />
      <div className="app-shell">
        <Sidebar />
        <main className="main-wrapper">
          <TopBar />

          {activeView === 'home' && <HomeView />}
          {activeView === 'finance' && <FinanceView />}
          {activeView === 'academic' && <AcademicView />}
          {activeView === 'accounts' && <AccountsView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      <CalendarDrawer />
      <ModalManager />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
