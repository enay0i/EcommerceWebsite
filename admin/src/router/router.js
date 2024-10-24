import AdminLayout from "../pages/AdminLayout"
import DashboardView from "../pages/DashboardView"
import ProductAdmin from "../pages/Products/ProductAdmin"
import ColorAdmin from "../pages/ColorAdmin"
import AddProduct from "../pages/Products/AddProduct"
import CategoryAdmin from "../pages/Categories/CategoryAdmin"
export const routers = [
   {
      path: "/",
      page: AdminLayout,
      children: [
        { path: "", page: DashboardView  }, 
        {path:"product",page:ProductAdmin},
        {path:"color",page:ColorAdmin},
        {path:"category",page:CategoryAdmin}
      ],
    },]