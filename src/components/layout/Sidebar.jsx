import{ useState } from 'react';
import * as Icons from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import navigation from '../../api/navigation.jsx';
import {logout} from '../../store/slices/authenticationSlice.jsx';

const Sidebar = () => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(null);
  const [sidebar, setSidebar] = useState(false);

  const handleManu = (key) => {
    setToggle((prevToggle) => (prevToggle === key ? null : key));
  };



  
  const handleSidebar = () => {
    setSidebar((prev) => (prev ? false : !prev));
  };

  const handleIsLogout = () => {
    dispatch(logout())
  };

  return (
    <div className={`sidemenu relative ${sidebar ? 'active' : ''}`}>
      {/* Admin User */}
      <div className="sidebar_profile ">
        {/* <Link to="/" className="logo">
          <img src={Logo} alt="logo" />
        </Link> */}

        <h2 className="logo_text">Masalakoottu</h2>
        
      </div>
       <div className={ `bg-gray-300 lg:hidden flex p-[6px] absolute top-[40%] left-[90%] rounded-2xl  text-yellow-300 text-2xl ${sidebar ? 'ml-1' : 'ml-12'} `}>
      <button className="" onClick={handleSidebar}>
        {sidebar ? <Icons.TbChevronsLeft size={30} /> : <Icons.TbChevronsRight size={30} />}
      </button>
       </div>
      {/* menu links */}
      <ul className="menu_main">
        {navigation.map(function (navigationItem, key) {
          return (
            <li key={key}>
              {!navigationItem.subMenu ? (
                <NavLink
                  to={`${navigationItem.url}`}
                  className={`menu_link ${toggle === key ? 'active' : ''}`}
                  onClick={() => handleManu(key)}
                >
                  {navigationItem.icon}
                  <span>{navigationItem.name}</span>
                  {navigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
                </NavLink>
              ) : (
                <div className="menu_link" onClick={() => handleManu(key)}>
                  {navigationItem.icon}
                  <span>{navigationItem.name}</span>
                  {navigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
                </div>
              )}
              {navigationItem.subMenu ? (
                <ul className={`sub_menu ${toggle === key ? 'active' : ''}`}>
                  {navigationItem.subMenu &&
                    navigationItem.subMenu.map(function (subNavigationItem, subKey) {
                      return (
                        <li key={subKey}>
                          <NavLink
                            to={`${navigationItem.url}${subNavigationItem.url}`}
                            className="menu_link"
                          >
                            {subNavigationItem.icon}
                            <span>{subNavigationItem.name}</span>
                            {subNavigationItem.subMenu ? <Icons.TbChevronDown /> : ''}
                          </NavLink>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                ''
              )}
            </li>
          );
        })}
        <div
          className={`menu_link`}
          onClick={handleIsLogout}
        >
          <Icons.TbLogout className="menu_icon" />
          <span>Logout</span>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;