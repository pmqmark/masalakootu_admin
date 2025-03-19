import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../store/slices/authenticationSlice.jsx';
import { useDispatch } from 'react-redux';
import * as Icons from 'react-icons/tb';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import CheckBox from '../../components/common/CheckBox.jsx';
import { loginAuth } from '../../lib/endPoints.js';
import axios from '../../config/axios.js';
import { toast } from 'sonner';
import { setAccessToken, setRefreshToken } from '../../store/slices/tockenSlicer.jsx';

const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    credential: "",
    password: "",
  });
  const [isRemember, setIsRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (fieldName, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: newValue,
    }));
  };

  const handleRememberChange = (check) => {
    setIsRemember(check);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(formData)
    setIsLoading(true)
    try {
      const res = await axios.post(loginAuth, formData);
      console.log(res.data);
      dispatch(login(res.data.data.userInfo));
      dispatch(setAccessToken(res.data.data.accessToken));
      dispatch(setRefreshToken(res.data.data.refreshToken));
      toast.success(res.data.data?.message || "Login Successfully")
    } catch (error) {
      setLoginError(true);
      console.log(error)
    } finally {
      setIsLoading(false)
      setLoginError(false);
    }
  };

  return (
    <div className="login">
      <div className="login_sidebar">
        <figure className="login_image">
          <img src="https://images.unsplash.com/photo-1694537745985-34eacdf76139?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" alt="" />
        </figure>
      </div>
      <div className="w-full lg:max-w-[500px] flex flex-col items-center justify-center p-5">
        <div className="w-full flex flex-col gap-5 mb-5 md:px-8">
          <div to="/" className="w-full ">
            {/* <img src={Logo} alt="logo" /> */}
            <h2 className='w-full font-semibold text-2xl'>Masalakooottu Admin</h2>
          </div>
          <h2 className="text-xl font-medium">Login</h2>
        </div>
        <form className="form space-y-5" onSubmit={handleLogin}>
          <div className="form_control">
            <Input
              type="text"
              value={formData.credential}
              onChange={(value) =>
                handleInputChange("credential", value)
              }
              placeholder="Email or Phone Number"
              icon={<Icons.TbMail />}
              label="Email or Number"
            />
          </div>
          <div className="form_control">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(value) =>
                handleInputChange("password", value)
              }
              placeholder="Password"
              label="Password"
              onClick={handleShowPassword}
              icon={<Icons.TbEye />}
            />
          </div>
          <div className="form_control">
            <CheckBox
              id="rememberCheckbox"
              label="Remember me"
              checked={isRemember}
              onChange={handleRememberChange}
            />
          </div>
          {loginError && <small className="incorrect">Incorrect email or password and Remember me</small>}
          <div className="form_control">
            <Button
              label={isLoading ? "Loading..." : "Submit"}
              type="submit"
            />
          </div>
        </form>
        <p className="flex gap-3 justify-start">
          Do you have any issue? <Link to="https://qmarktechnolabs.com">Qmark Technolabs</Link>
        </p>
        {/* <button className="google_signin">
          <figure>
            <img src="https://img.icons8.com/color/1000/google-logo.png" alt="" />
          </figure>
          <h2>Sign in with Google</h2>
        </button> */}
      </div>
    </div>
  );
}

export default Login;