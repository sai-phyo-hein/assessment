import { useState, useEffect } from 'react';
import Navbar from './homepage/navbar';
import Search from './homepage/search';
import LocationGallery from './homepage/location-gallery';
import PropertyPage from './propertypage/propertypage';
import PropertyDetailPage from './propertydetails/propertydetailpage';
import Modal from './components/popup';
import Dashboard from './dashboardpage/dashboard';
import { useAppStore } from './global-store';

function App() {
  const { showPropertyPage, showPropertyDetailPage, pageId, isAuth, isManager} = useAppStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isAuth]);

  return (
    <div className="min-h-screen bg-milk-yellow">
      {isManager ? (
        <Dashboard />
      ) : (
        <div className={showModal ? 'blur-sm opacity-75' : ''}>
          <Navbar />
          {showPropertyDetailPage && pageId ? (
            <PropertyDetailPage folderId={pageId} />
          ) : showPropertyPage ? (
            <PropertyPage />
          ) : (
            <>
              <Search />
              <LocationGallery />
            </>
          )}
          <main className="mt-20 p-8">
            <div className="container mx-auto">
            </div>
          </main>
        </div>
      )}
      {showModal && <Modal />}
    </div>
  );
}

export default App;
