import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useProvideAuth } from './auth';
import './Login.css';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const location = useLocation();
    const auth = useProvideAuth();
    const onSubmit = async (data) => {
        try {
            await auth.handleLogin(data.username, data.password);
            const { from } = location.state || { from: { pathname: '/' } };
            history.replace(from);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <p>Login with your Tabroom.com username and password</p>
            <form className="pure-form pure-form-stacked" onSubmit={handleSubmit(onSubmit)}>
                Username:<input type="text" {...register('username')} />
                Password:<input type="password" {...register('password')} />
                <button className="pure-button pure-button-primary" type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
