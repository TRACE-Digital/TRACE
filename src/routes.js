/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Search from "views/Search.js";
import Analytics from "views/Analytics.js";
import UserProfile from "views/UserProfile.js";
import Editor from "views/Editor.js";
import Contact from "views/Contact.js";
import Settings from "components/Settings/Settings";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-laptop",
    component: Dashboard,
    layout: "",
  },
  {
    path: "/search",
    name: "Search",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-zoom-split",
    component: Search,
    layout: "",
  },
  {
    path: "/analytics",
    name: "Analytics",
    rtlName: "إخطارات",
    icon: "tim-icons icon-chart-bar-32",
    component: Analytics,
    layout: "",
  },
  {
    path: "/profile-editor",
    name: "Profile Editor",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-pencil",
    component: Editor,
    layout: "",
  },
  {
    path: "/settings",
    name: "Settings",
    rtlName: "",
    icon: "tim-icons icon-settings",
    component: Settings,
    layout: "",
  },
  {
    path: "/contact",
    name: "Contact Us",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-send",
    component: Contact,
    layout: "",
  },
  {
    path: "/about",
    name: "About Us",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "",
  }

];
export default routes;
