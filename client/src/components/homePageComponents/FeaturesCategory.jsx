import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveFeatureIndex } from '../../store/slices/navItems/navItemsSlice';

function FeaturesCategory() {
  const navCategoryData = useSelector((state) => state.navItems.navItemCategoryData);
  const activeIndex = useSelector((state) => state.navItems.activeFeatureIndex);
  const dispatch = useDispatch();


  // const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const handleItemClick = (index, slug) => {
    if(index !== null && index !== undefined) dispatch(setActiveFeatureIndex({ activeIndex: index }));
    navigate(slug);
  };

  return navCategoryData ? (
    <div className='h-screen mt-3 rounded-r-md w-1/6 bg-primary'>
      <ul className='flex flex-col gap-1 pt-4 w-full justify-center px-4'>
        {navCategoryData.map((item, i) => 
        (
          <li
            key={i}
            className={`w-full ${!item.active ? 'cursor-not-allowed pointer-events-none' : ''}`}
            onClick={() => handleItemClick(i, item.slug)}
          >
            <button className={`text-left  px-2 py-1 rounded ${item.active ? 'cursor-pointer ' : 'opacity-50 cursor-not-allowed pointer-events-none'} duration-300 ${
              activeIndex === i ? 'bg-white py-2 text-sm text-black' : `text-white ${item.active ? 'text-xs' : ' text-xs' }`
            }`}
            disabled={!item.active}
            >{item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}

export default FeaturesCategory;
