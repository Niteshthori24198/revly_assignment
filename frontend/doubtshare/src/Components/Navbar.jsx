import { NavLink } from 'react-router-dom'
import { appContext } from '../AuthContext/AuthContextProvider'
import { useContext } from 'react'

let links = [

    {
        to: "/Home",
        label: "Home"

    },
    {
        to: "/Add-user",
        label: "Register"
    },
    {
        to: "Create-doubt",
        label: "Create Doubt"
    },
    {
        to: "Doubts",
        label: "Doubts"
    },
    {
        to: "/Login",
        label: "Login"
    },

]


export default function Navbar() {

    const { isAuth, userRole } = useContext(appContext);

    if(userRole === 'tutor'){
        links = links.filter((ele) => ele.label !== 'Create Doubt');
    }
    if(isAuth){
        links = links.filter((ele) => ele.label !== 'Register');
    }

    const defaultstyle = {
        textDecoration: 'none',
        fontFamily: 'cursive',
        fontWeight: 'bold',
        color: 'blue',
        fontSize: "18px"
    }

    const activeStyle = {
        textDecoration: 'none',
        fontFamily: 'cursive',
        fontWeight: 'bolder',
        color: 'red',
        fontSize: "18px"
    }


    return <div style={{ display: 'flex', justifyContent: 'space-around', margin: '15px auto' }}>

        {

            links.map((ele, i) => {

                if (isAuth && ele['label'] === 'Login') {
                    ele['label'] = 'Logout';
                    ele['to'] = '/Logout'
                } else if (!isAuth && ele['label'] === 'Logout') {
                    ele['label'] = 'Login';
                    ele['to'] = '/Login'

                }

                return <NavLink to={ele.to} key={i} style={
                    ({ isActive }) => {
                        return isActive ? activeStyle : defaultstyle
                    }
                }>{ele.label}</NavLink>
            })

        }

    </div>

}