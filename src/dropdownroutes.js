import Login from "views/Login.js";
import Settings from "views/Settings.js";

var dropdownroutes = [
  {
    path: "/login",
    name: "Login",
    icon: "tim-icons icon-laptop",
    component: Login,
    layout: "/admin",
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "tim-icons icon-zoom-split",
    component: Settings,
    layout: "/admin",
  }
];
export default dropdownroutes;
