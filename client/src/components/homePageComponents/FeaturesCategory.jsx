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
    <div className='h-screen w-1/6 bg-gray-600'>
      <ul className='flex flex-col gap-1 pt-4 w-full justify-center px-4'>
        {navCategoryData.map((item, i) => 
        item.active && (
          <li
            key={i}
            className={` font-light  px-2 py-1 rounded cursor-pointer duration-300 ${
              activeIndex === i ? 'bg-white py-2 text-sm text-black' : 'text-gray-300 text-xs'
            }`}
            onClick={() => handleItemClick(i, item.slug)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}

export default FeaturesCategory;
