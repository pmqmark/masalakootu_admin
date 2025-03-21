import * as Icons from "react-icons/tb";
import Input from '../common/Input.jsx';
import Profile from '../common/Profile.jsx';
import ProfileImg from '../../../public/logoFav.png';
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state)=> state.authentication.user)

  return (
    <div className="navbar">
      <div className="navbar_wrapper">
        <div className="container">
          <div className="navbar_main">
            <Input
              icon={<Icons.TbSearch />}
              placeholder="Search..."
              className="navbar_search"
            />
            <div className="navbar_icons">
              {/* <Link className="navbar_icon">
                <Icons.TbLayoutGrid />
              </Link>
              <Link className="navbar_icon">
                <Icons.TbChartLine />
              </Link>
              <Link className="navbar_icon">
                <Icons.TbMessage2 />
              </Link>
              <Link className="navbar_icon">
                <Icons.TbSunHigh />
              </Link> */}
              <Profile
                name={user.firstName}
                slogan={user.email}
                className="admin_profile"
                src={ProfileImg}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;