import {
  GoAAppHeader,
  GoAMicrositeHeader,
  GoAAppFooter,
  GoAPageBlock,
  GoAPage,
} from '@abgov/react-components';
import { Outlet } from 'react-router-dom';

export function App() {

  return (
    <GoAPage>
      <section slot="header">
        <GoAMicrositeHeader level="alpha" version="UAT" />
        <GoAAppHeader url="/" title="Design System">
          <a href="/login">Sign in</a>
        </GoAAppHeader>
      </section>

      <GoAPageBlock width="704px">
        <Outlet />
      </GoAPageBlock>

      <section slot="footer">
        <GoAAppFooter />
      </section>
    </GoAPage>
  );
}

export default App;
