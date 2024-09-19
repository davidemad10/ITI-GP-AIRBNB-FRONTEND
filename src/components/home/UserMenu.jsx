import React from 'react';
import { Menu } from 'lucide-react';
import AvatarComponent from './Avatar';

const UserMenu = () => {
  return (
    <div className="dropdown">
      <button
        className="btn d-flex align-items-center gap-2 p-2 rounded-circle border"
        type="button"
        id="userMenuDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Menu />
        <AvatarComponent />
      </button>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuDropdown">
      <li>
          <a className="dropdown-item" href="#">login up</a>
        </li>
        <li>
          <a className="dropdown-item" href="#">Sign up</a>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <a className="dropdown-item" href="#">Gift cards</a>
        </li>
        <li>
          <a className="dropdown-item" href="#">Airbnb your home</a>
        </li>
        <li>
          <a className="dropdown-item" href="#">host an experience</a>
        </li>
        <li>
          <a className="dropdown-item" href="#">Help Center</a>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
