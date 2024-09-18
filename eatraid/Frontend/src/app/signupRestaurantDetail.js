import React from 'react';
import './signupRestaurantDetail.css';
import { BsChevronDown } from "react-icons/bs";
import Dropdown from 'react-dropdown';

const categoryDropdown = ['Thai', 'Japanese'];

function signupRestaurantDetail() {
  const defaultOption = categoryDropdown[0];

  return (
    <div className='main-bg'>
      <div className='big-container'>
        <h1 className='title'>Sign Up - Restaurant</h1>
        <div className='textfield-big-container'>
          <div className='textfield-sub-container'>
            <h2 className='normal-text'>Name</h2>
            <input name='Name' className='textfield-style' />
          </div>

          <div className='textfield-sub-container'>
            <h2 className='normal-text'>Category</h2>
            <div className='dropdown-with-icon'>
              <Dropdown
                options={categoryDropdown}
                value={defaultOption}
                placeholder="Select an option"
                className='textfield-style'
              />
              <BsChevronDown className='dropdown-icon' />
            </div>
          </div>

          <div className='textfield-sub-container'>
            <h2 className='normal-text'>Business day</h2>
            <input name='BusinessDay' className='textfield-style' />
          </div>

          <div className='textfield-sub-container'>
            <h2 className='normal-text'>Open time</h2>
            <input name='OpenTime' className='textfield-style-mini' />
            <h2 className='normal-text'>Close time</h2>
            <input name='CloseTime' className='textfield-style-mini' />
          </div>

          <div className='textfield-sub-container'>
            <h2 className='normal-text'>Contact</h2>
            <input name='Contact' className='textfield-style' />
          </div>

        </div>
      </div>
    </div>
  );
}

export default signupRestaurantDetail;
