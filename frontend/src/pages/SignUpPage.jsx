import React, { useState } from "react";
import BorderAnimatedContainer from './../components/BorderAnimatedContainer';
import useAuthStore from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { MessageCircle, User, Mail, Lock, Loader } from "lucide-react";


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const {signup, isSigningUP} = useAuthStore()
  const handleSubmit = (e)=>{
    e.preventDefault()
    signup(formData)
  }
  return <div className="w-full flex items-center justify-center p-4  bg-slate-900">
    <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
      <BorderAnimatedContainer>
      <div className="w-full flex flex-col md:flex-row ">
        {/* FORM column - left side */}
        <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">

        <div className="w-full max-w-md">
          {/* Heading text */}
          <div className="text-center mb-8">
            <MessageCircle className="w-12 h-12 mx-auto text-slate-400 mb-4"/>
            <h2 className="text-2xl font-bold text-slate-200 mb-2">
              Create your account
            </h2>
            <p className="text-slate-400">
              Sign up for a new account
            </p>
        </div>

        {/* Signup Form */}
        <form className="space-y-6 " onSubmit={handleSubmit}>
          {/* full name */}
          <div>
            <label className="auth-input-label">Full Name</label>
            <div className="relative">
              <User className="auth-input-icon"/>
              <input type="text"  
                    className="input" 
                    placeholder="Ahmed Basuony" 
                    value={formData.name} 
                    onChange={(e)=> setFormData({...formData, name: e.target.value})}/>
            </div>
          </div>
          {/* EMAIL INPUT */}
          <div>
            <label className="auth-input-label">Email</label>
            <div className="relative">
              <Mail className="auth-input-icon"/>
              <input type="email"  
                    className="input" 
                    placeholder="ahmedbasuony@gmail.com" 
                    value={formData.email} 
                    onChange={(e)=> setFormData({...formData, email: e.target.value})}/>
            </div>
          </div>
           {/* PASSWORD INPUT */}
          <div>
            <label className="auth-input-label">Password</label>
            <div className="relative">
              <Lock className="auth-input-icon"/>
              <input type="password"  
                    className="input" 
                    placeholder="Enter your password"
                    value={formData.password} 
                    onChange={(e)=> setFormData({...formData, password: e.target.value})}/>
            </div>
          </div>
           {/* PASSWORD INPUT */}
          <div>
            <label className="auth-input-label">Password</label>
            <div className="relative">
              <Lock className="auth-input-icon"/>
              <input type="password"  
                    className="input" 
                    placeholder="confirm your password"
                    value={formData.confirmPassword} 
                    onChange={(e)=> setFormData({...formData, confirmPassword: e.target.value})}/>
            </div>
          </div>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="auth-btn flex items-center justify-center" 
            disabled={isSigningUP}
          >
            {isSigningUP ? (<Loader className="w-5 h-5 animate-spin "/>) : ("Create Account")}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="auth-link">Already have an account? Login</Link>
        </div>
      </div>
        </div>
      </div>
      </BorderAnimatedContainer>
    </div>
  </div>;
};

export default SignUpPage;
