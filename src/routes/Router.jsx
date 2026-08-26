import { createBrowserRouter } from "react-router-dom";

import { Login } from '../pages/auth/Login/login.jsx';
import { SingUp } from '../pages/auth/SingUp/singup.jsx';
import { Home } from '../pages/dashboard/features/prime/Home/home.jsx';
import { Add } from '../pages/dashboard/features/actions/views/Add/add.jsx';
import { Check } from '../pages/dashboard/features/actions/views/Check/check.jsx';
import { EditItem } from '../pages/dashboard/features/actions/views/EditItem/edititem.jsx';
import { Register } from '../pages/dashboard/features/actions/views/Register/register.jsx';
import { Remove } from '../pages/dashboard/features/actions/views/Remove/remove.jsx';
import { RemoveItem } from '../pages/dashboard/features/actions/views/RemoveItem/removeitem.jsx';
import { ErrorPage } from "./error/errorPage.jsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/singup',
        element: <SingUp/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/home',
        element: <Home/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/home/cadastrar-produto',
        element: <Register/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/home/adicionar-ao-estoque',
        element: <Add/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/home/remover-do-estoque',
        element: <Remove/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/home/verificar-estoque',
        element: <Check/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/home/verificar-estoque/editar/:id',
        element: <EditItem/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/home/verificar-estoque/excluir/:id',
        element: <RemoveItem/>,
        errorElement: <ErrorPage/>
    }
]);