import './App.css';
import Navbar from './homepage/navbar';
import Search from './homepage/search';
import LocationGallery from './homepage/location-gallery';
import PropertyPage from './propertypage/propertypage';
import { useAppStore } from './global-store';

function App() {
  const { showPropertyPage } = useAppStore();

  return (
    <div className="App">
      <Navbar />
      {showPropertyPage ? (
        <PropertyPage />
      ) : (
        <>
          <Search />
          <LocationGallery />
        </>
      )}
      <main style={{ marginTop: '80px', padding: '2rem' }}>
        <div className="container">
          {/* <h1>Welcome to Flex Living Assessment App</h1>
          <p>Your navbar should be visible at the top of the page.</p> */}
        </div>
      </main>
    </div>
  );
}

export default App;
