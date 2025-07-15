/* eslint-disable react/prop-types */
// import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveFeatureIndex, setNavItemCategoryData } from '../../../store/slices/navItems/navItemsSlice';

// eslint-disable-next-line react/prop-types
function Navbar({ data, currentUser }) { // Keep currentUser prop if you use it elsewhere, or remove if isAdmin() / isOwner() handle all user checks upstream
    const navData = data;
    const dispatch = useDispatch();

    // Determine if the current user is an admin.
    // This assumes currentUser is passed and has a 'data.role' property.
    // If isAdmin() function already relies on global state or context,
    // you might not need currentUser prop here, but it's good for clarity.
    const userIsAdmin = currentUser?.role?.toLowerCase() === 'admin';
    console.log('userIsAdmin', userIsAdmin)


    const handleNavItems = (i) => {
        const item = navData[i];

        // If the item is not active, prevent any Redux dispatches.
        if (!item.active) {
            return;
        }

        if (item && item.Children) {
            dispatch(setNavItemCategoryData(item.Children));
        } else {
            // If an item has no children, clear the category data
            dispatch(setNavItemCategoryData(null));
        }
        dispatch(setActiveFeatureIndex({ activeIndex: null }));
    }

    return (
        <>
            <nav className="relative">
                <div>
                    <ul className="flex items-center justify-center gap-4 text-white font-">
                        {navData.map((item, i) => {
                            // --- NEW FILTERING LOGIC ---
                            // If the item is marked as 'isAdmin' true,
                            // and the current user is NOT an admin, then skip rendering this item.
                            if (item.isAdmin && !userIsAdmin) {
                                return null; // Don't render this item
                            }
                            // --- END NEW FILTERING LOGIC ---

                            // The `item.active` property directly tells us if the feature is accessible (enabled/disabled)
                            const isFeatureDisabled = !item.active;

                            // Apply appropriate classes for disabled state
                            const disabledClasses = isFeatureDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

                            return (
                                <li
                                    key={i}
                                    className={`${disabledClasses}`}
                                >
                                    <button
                                        onClick={() => handleNavItems(i)}
                                        disabled={isFeatureDisabled}
                                        className="focus:outline-none"
                                    >
                                        <NavLink
                                            to={item.slug}
                                            className={({ isActive }) =>
                                                `block text-sm py-2 pr-4 pl-3 duration-200
                                                ${isActive ? "shadow-md border-t-2" : ""}
                                                hover:shadow-md px-3 rounded-2xl py-2 w-auto text-nowrap relative
                                                ${disabledClasses}`
                                            }
                                            onClick={(e) => {
                                                if (isFeatureDisabled) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            {item.name}
                                        </NavLink>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Navbar;