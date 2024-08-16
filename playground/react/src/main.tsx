import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@abgov/web-components";
import App from "./app/app";
import Accordion from "./routes/accordion";
import AppFooter from "./routes/appFooter";
import AppHeader from "./routes/appHeader";
import Badge from "./routes/badge";
import Button from "./routes/button";
import ButtonGroup from "./routes/buttonGroup";
import Callout from "./routes/callout";
import Chip from "./routes/chip";
import CircularProgress from "./routes/circularProgress";
import Container from "./routes/container";
import Divider from "./routes/divider";
import Dropdown from "./routes/dropdown";
import FormItem from "./routes/formItem";
import HeroBanner from "./routes/heroBanner";
import Icon from "./routes/icon";
import IconButton from "./routes/iconButton";
import Input from "./routes/input";
import MicrositeHeader from "./routes/micrositeHeader";
import Modal from "./routes/modal";
import NotificationBanner from "./routes/notificationBanner";
import Pagination from "./routes/pagination";
import Popover from "./routes/popover";
import Radio from "./routes/radio";
import SideMenu from "./routes/sideMenu";
import Skeleton from "./routes/skeleton";
import Styles from "./routes/styles";
import Table from "./routes/table";
import TextArea from "./routes/textarea";
import Tooltip from "./routes/tooltip";
import ThreeColumnLayout from "./routes/threeColumnLayout";
import Details from "./routes/details";
import Tabs from "./routes/tabs";
import { FormStepperRoute } from "./routes/formStepper";
import Checkbox from "./routes/checbox";
import { Datepicker } from "./routes/datepicker";
import SimpleForm from "./routes/simple-form";
import { PublicForm } from "./routes/public-form";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="simple-form" element={<SimpleForm />} />
          <Route path="public-form" element={<PublicForm />} />
          <Route path="accordion" element={<Accordion />} />
          <Route path="app-footer" element={<AppFooter />} />
          <Route path="app-header" element={<AppHeader />} />
          <Route path="badge" element={<Badge />} />
          <Route path="button" element={<Button />} />
          <Route path="button-group" element={<ButtonGroup />} />
          <Route path="callout" element={<Callout />} />
          <Route path="checkbox" element={<Checkbox />} />
          <Route path="chip" element={<Chip />} />
          <Route path="chip/:id" element={<>Chip 123</>} />
          <Route path="circular-progress" element={<CircularProgress />} />
          <Route path="container" element={<Container />} />
          <Route path="date-picker" element={<Datepicker />} />
          <Route path="divider" element={<Divider />} />
          <Route path="dropdown" element={<Dropdown />} />
          <Route path="form-item" element={<FormItem />} />
          <Route path="hero-banner" element={<HeroBanner />} />
          <Route path="icon" element={<Icon />} />
          <Route path="icon-button" element={<IconButton />} />
          <Route path="input" element={<Input />} />
          <Route path="microsite-header" element={<MicrositeHeader />} />
          <Route path="modal" element={<Modal />} />
          <Route path="notification-banner" element={<NotificationBanner />} />
          <Route path="pagination" element={<Pagination />} />
          <Route path="popover" element={<Popover />} />
          <Route path="radio" element={<Radio />} />
          <Route path="side-menu" element={<SideMenu />} />
          <Route path="skeleton" element={<Skeleton />} />
          <Route path="styles" element={<Styles />} />
          <Route path="table" element={<Table />} />
          <Route path="textarea" element={<TextArea />} />
          <Route path="tooltip" element={<Tooltip />} />
          <Route path="three-column-layout" element={<ThreeColumnLayout />} />
          <Route path="details" element={<Details />} />
          <Route path="form-stepper" element={<FormStepperRoute />} />
          <Route path="tabs" element={<Tabs />} />
        </Route>
      </Routes>
    </BrowserRouter>
    ,
  </StrictMode>,
);
