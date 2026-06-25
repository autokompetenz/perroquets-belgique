import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { useThemeStore, useLangStore } from './store';
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClientBottomNav from './components/ClientBottomNav';
import MailButton from './components/MailButton';
import DeliveryModal from './components/DeliveryModal';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import PuppyDetails from './pages/PuppyDetails';
import Track from './pages/Track';


import Legal from './pages/Legal';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPuppies from './pages/admin/AdminPuppies';
import AdminPuppyForm from './pages/admin/AdminPuppyForm';
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
      <DeliveryModal />
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
        <Route path="/puppy/:slug" element={<PublicRoute element={<PuppyDetails />} />} />
        <Route path="/track" element={<PublicRoute element={<Track />} />} />
        <Route path="/track/:number" element={<PublicRoute element={<Track />} />} />


        <Route path="/legal" element={<PublicRoute element={<Legal />} />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="puppies" element={<AdminPuppies />} />
          <Route path="puppies/new" element={<AdminPuppyForm />} />
          <Route path="puppies/:id/edit" element={<AdminPuppyForm />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="reservations/:id" element={<AdminReservationDetail />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="waitlist" element={<AdminWaitlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
