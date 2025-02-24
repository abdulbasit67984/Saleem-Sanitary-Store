// import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveFeatureIndex, setNavItemCategoryData } from '../../../store/slices/navItems/navItemsSlice';

// eslint-disable-next-line react/prop-types
function Navbar({ data }) {
    const navData = data;

    const dispatch = useDispatch();


    const handleNavItems = (i) => {
        if (navData[i]) dispatch(setNavItemCategoryData(navData[i].Children));
        dispatch(setActiveFeatureIndex({ activeIndex: null }))
    }


    return (
        <>
            <nav className="relative">
                <div>
                    <ul className="flex items-center justify-center gap-4 text-white font-light">
                        {navData.map((item, i) =>
                            item.active ? (
                                <li
                                    key={i}
                                    className={``}
                                    
                                >
                                    <button onClick={() => {
                                        handleNavItems(i);
                                    }
                                    } >
                                        <NavLink to={item.slug} className={({ isActive }) =>
                                            `block text-sm py-2 pr-4 pl-3 duration-200 ${isActive ? "shadow-md border-t-2" : ""} hover:shadow-md cursor-pointer px-3 rounded-2xl py-2 w-auto text-nowrap relative`}>{item.name}</NavLink>
                                    </button>
                                </li>
                            ) : null
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
