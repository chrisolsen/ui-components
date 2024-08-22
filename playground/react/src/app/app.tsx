import {
  GoAAppFooter,
  GoAAppHeader,
  GoAMicrositeHeader,
  GoASideMenu,
  GoASideMenuGroup,
  GoATwoColumnLayout,
} from "@abgov/react-components";
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <GoATwoColumnLayout
      header={
        <>
          <GoAMicrositeHeader type="alpha" version="UAT"></GoAMicrositeHeader>
          <GoAAppHeader heading="Design system" maxContentWidth={"1500px"} url={"/"} fullMenuBreakpoint={1140}>
            <Link to="/get-started">Get started</Link>
            <Link to="/patterns">Patterns and templates</Link>
            <Link to="/components">Components</Link>
            <Link to="/design-tokens">Styles</Link>
            <Link to="/content/capitalization">Content</Link>
            <Link to="/support">Support</Link>
            <Link to="https://github.com/GovAlta/ui-components/issues/new/choose" target="_blank">
              Report a bug
            </Link>
          </GoAAppHeader>
        </>
      }
      footer={<GoAAppFooter />}
      nav={
        <GoASideMenu>
          <GoASideMenuGroup heading="Components">
            <Link to="/">Nothing here</Link>
            <Link to="/public-form">Public Form</Link>
            <Link to="/accordion">Accordion</Link>
            <Link to="/app-footer">AppFooter</Link>
            <Link to="/app-header">App Header</Link>
            <Link to="/badge">Badge</Link>
            <Link to="/button">Button</Link>
            <Link to="/button-group">Button Group</Link>
            <Link to="/callout">Callout</Link>
            <Link to="/checkbox">Checkbox</Link>
            <Link to="/chip">Chip</Link>
            <Link to="/circular-progress">Circular Progress</Link>
            <Link to="/container">Container</Link>
            <Link to="/date-picker">Datepicker</Link>
            <Link to="/divider">Divider</Link>
            <Link to="/dropdown">Dropdown</Link>
            <Link to="/file-upload">File Upload</Link>
            <Link to="/form-item">Form Item</Link>
            <Link to="/hero-banner">Hero Banner</Link>
            <Link to="/icon">Icon</Link>
            <Link to="/icon-button">Icon Button</Link>
            <Link to="/input">Input</Link>
            <Link to="/microsite-header">Microsite header</Link>
            <Link to="/modal">Modal</Link>
            <Link to="/notification-banner">Notification Banner</Link>
            <Link to="/pagination">Pagination</Link>
            <Link to="/popover">Popover</Link>
            <Link to="/radio">Radio</Link>
            <Link to="/side-menu">SideMenu</Link>
            <Link to="/skeleton">Skeleton</Link>
            <Link to="/styles">Styles</Link>
            <Link to="/table">Table</Link>
            <Link to="/textarea">TextArea</Link>
            <Link to="/tooltip">Tooltip</Link>
            <Link to="/tabs">Tabs</Link>
            <Link to="/form-stepper">FormStepper</Link>
          </GoASideMenuGroup>
          <GoASideMenuGroup heading="Layout">
            <Link to="/three-column-layout">Three Column Layout</Link>
          </GoASideMenuGroup>
        </GoASideMenu>
      }
    >
      <Outlet />
    </GoATwoColumnLayout>
  );
}