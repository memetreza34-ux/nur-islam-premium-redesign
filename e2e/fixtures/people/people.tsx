import { createRoot } from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/amiri/400.css';
import { LegacyFeatureScreen } from '../../../src/screens/LegacyFeatureScreens';
import '../../../src/styles.css';
import '../../../src/styles/premium-legacy-art-final.css';
import '../../../src/styles/premium-local-features.css';

// Test-only mounting of retained screens, not a new production route.
const featureId = new URLSearchParams(location.search).get('feature') === 'women' ? 'women' : 'sahabah';
createRoot(document.getElementById('root')!).render(
  <div className="app-background app-background--v2">
    <div className="app-shell app-shell--detail">
      <div className="screen-transition-frame">
        <LegacyFeatureScreen featureId={featureId} onBack={() => history.back()} />
      </div>
    </div>
  </div>,
);
