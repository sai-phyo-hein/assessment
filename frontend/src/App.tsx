import Navbar from './homepage/navbar';
import Search from './homepage/search';
import LocationGallery from './homepage/location-gallery';
import PropertyPage from './propertypage/propertypage';
import PropertyDetailPage from './propertydetails/propertydetailpage';
import { useAppStore } from './global-store';

function App() {
  const { showPropertyPage, showPropertyDetailPage } = useAppStore();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {showPropertyDetailPage ? (
        <PropertyDetailPage />
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
          {/* <h1>Welcome to Flex Living Assessment App</h1>
          <p>Your navbar should be visible at the top of the page.</p> */}
        </div>
      </main>
    </div>
  );
}

export default App;
