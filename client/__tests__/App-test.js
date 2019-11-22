import React from 'react';
import { shallow } from 'enzyme';
import Login from './screens';


describe('Test case for testing login',() =>{
  let wrapper;
  test('email input check',()=>
  {
    wrapper = shallow(<Login/>);
    wrapper.find('input[type="text"]').simulate('change', {target: {name: 'email', value: 'tobiguthix@gmail.com'}});
    expect(wrapper.state('email')).toEqual('tobiguthix@gmail.com');
  })
  it('password input check',()=>{
    wrapper = shallow(<Login/>);
    wrapper.find('input[type="password"]').simulate('change', {target: {name: 'password', value: 'password123'}});
    expect(wrapper.state('password')).toEqual('password123');
  })
  it('checks wrong email right pass',()=>{
    wrapper = shallow(<Login/>);
    wrapper.find('input[type="text"]').simulate('change', {target: {name: 'email', value: 'tix@gmail.com'}});
    wrapper.find('input[type="password"]').simulate('change', {target: {name: 'password', value: 'test123'}});
    wrapper.find('button').simulate('click');
    expect(wrapper.state('isLoggedIn')).toBe(false);
  })
  it('checks right email wrong pass',()=>{
    wrapper = shallow(<Login/>);
    wrapper.find('input[type="text"]').simulate('change', {target: {name: 'email', value: 'tobiguthix@gmail.com'}});
    wrapper.find('input[type="password"]').simulate('change', {target: {name: 'password', value: '8a8sdahikkk  **j'}});
    wrapper.find('button').simulate('click');
    expect(wrapper.state('isLoggedIn')).toBe(false);
  })
  it('checks valid sign in',()=>{
    wrapper = shallow(<Login/>);
    wrapper.find('input[type="text"]').simulate('change', {target: {name: 'email', value: 'tobiguthix@gmail.com'}});
    wrapper.find('input[type="password"]').simulate('change', {target: {name: 'password', value: 'test123'}});
    wrapper.find('button').simulate('click');
    expect(wrapper.state('isLoggedIn')).toBe(true);
})
