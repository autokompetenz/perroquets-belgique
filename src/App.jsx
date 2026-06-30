import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { useThemeStore, useLangStore } from './store';
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClientBottomNav from './components/ClientBottomNav';
import MailButton from './components/MailButton';



import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ParrotDetails from './pages/ParrotDetails';
import Track from './pages/Track';


import Legal from './pages/Legal';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminParrots from './pages/admin/AdminParrots';
import AdminParrotForm from './pages/admin/AdminParrotForm';
import AdminReservations from './pages/admin/AdminReservations';
import AdminReservationDetail from './pages/admin/AdminReservationDetail';
import AdminClients from './pages/admin/AdminClients';
import AdminWaitlist from './pages/admin/AdminWaitlist';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ClientBottomNav />
      <MailButton />
      <Toast />
    </>
  );
}

function PublicRoute({ element }) {
  return <PublicLayout>{element}</PublicLayout>;
}

export default function App() {
  const { theme } = useThemeStore();
  const { lang } = useLangStore();

  useEffect(() => {
    document.documentElement.lang = lang || 'fr';
  }, [lang]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicRoute element={<Home />} />} />
        <Route path="/catalog" element={<PublicRoute element={<Catalog />} />} />
        <Route path="/parrot/:slug" element={<PublicRoute element={<ParrotDetails />} />} />
        <Route path="/track" element={<PublicRoute element={<Track />} />} />
        <Route path="/track/:number" element={<PublicRoute element={<Track />} />} />


        <Route path="/legal" element={<PublicRoute element={<Legal />} />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="parrots" element={<AdminParrots />} />
          <Route path="parrots/new" element={<AdminParrotForm />} />
          <Route path="parrots/:id/edit" element={<AdminParrotForm />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="reservations/:id" element={<AdminReservationDetail />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="waitlist" element={<AdminWaitlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
