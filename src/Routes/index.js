import { Navigate } from 'react-router-dom'
import Admin from '../pages/Admin'
import Login from '../pages/Login'
import Category from '../pages/category';
import Product from '../pages/product';
import User from '../pages/user';
import Role from '../pages/role';
import Pie from '../pages/charts/pie';
import Bar from '../pages/charts/bar';
import Line from '../pages/charts/line';
import Home from '../pages/home';
import ProductHome from '../pages/product/home';
import Addupdate from '../pages/product/addupdate';
import Detail from '../pages/product/detail';
const routeRules = [
    {
        path: '/',
        element: <Admin />,
        children: [
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'products',
                children: [
                    {
                        path: 'category',
                        element: <Category />,
                    },
                    {
                        path: 'product',
                        element: <Product />,
                        children:[
                            {
                                path:"",
                                element:<ProductHome/>
                            },
                            {
                                path:"addupdate",
                                element:<Addupdate/>
                            },
                            {
                                path:"detail",
                                element:<Detail/>
                            },
                        ]
                    },
                    {
                        path: '*',
                        element: <Navigate to='category' />,
                    },
                ]
            },
            {
                path: 'user',
                element: <User />,
            },
            {
                path: 'role',
                element: <Role />,
            },
            {
                path: 'charts',
                children: [
                    {
                        path: 'bar',
                        element: <Bar />,
                    },
                    {
                        path: 'pie',
                        element: <Pie />,
                    },
                    {
                        path: 'line',
                        element: <Line />,
                    },
                    {
                        path: '',
                        element: <Navigate to='/charts/bar' />
                    }
                ]
            },
            {
                path: '',
                element: <Navigate to='home' />
            },
        ]
    },
    {
        path: '/login',
        element: <Login />
    }
]
export default routeRules