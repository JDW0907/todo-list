import React, { Component } from 'react';
import './UserDialog.css'
import {signUp, signIn, sendPasswordResetEmail} from './leanCloud'
import ForgotPasswordForm from './ForgotPasswordForm'
import SignInOrSignUp from './SignInOrSignUp'
export default class UserDialog extends Component{
  constructor(props){
    super(props)
    this.state = {
      selectedTab: 'signInOrSignUp', // 'forgotPassword'
      formData: {
        email: '',
        username: '',
        password: '',
      }
    }
  }
  signUp(e){
    e.preventDefault()
    let {email, username, password} = this.state.formData
    let re = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/i
    let ru = /^\w{3,20}$/i
    let rp =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/

    if (!username || !password || !email) {
      alert('用户名、密码、或邮箱不得为空')
      return
    } else if (!re.test(email)) {
      alert('请输入正确的邮箱格式')
      return
    }
    else if (!ru.test(username)) {
      alert('用户名必须大于三个字符')
      return
    }
    else if (!ru.test(password)) {
      alert('密码必须大于六个字符')
      return
    }
    let success = (user)=>{
      this.props.onSignUp.call(null, user)
    }
    let error = (error)=>{
      switch(error.code){
        case 202:
          alert('用户名已被占用')
          break
        default:
          alert(error)
          break
      }
    }
    signUp(email, username, password, success, error)
  }
  signIn(e){
    e.preventDefault()
    let {username, password,email} = this.state.formData
    let re = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/i
    let ru = /^\w{3,20}$/i
    let rp =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
   
    if (!username || !password || !email) {
      alert('用户名、密码、或邮箱不得为空')
      return
    } else if (!re.test(email)) {
      alert('请输入正确的邮箱格式')
      return
    } else if (!ru.test(username)) {
      alert('用户名必须大于三个字符')
      return
    }
    else if (!ru.test(password)) {
      alert('密码必须大于六个字符')
      return
    }
    let success = (user)=>{
      this.props.onSignIn.call(null, user)
    }
    let error = (error)=>{
      switch(error.code){
        case 210:
          alert('用户名与密码不匹配')
          break
        default:
          alert(error)
          break
      }
    }
    signIn(username, password, success, error)
  }
  changeFormData(key, e){
    let stateCopy = JSON.parse(JSON.stringify(this.state))  // 用 JSON 深拷贝
    stateCopy.formData[key] = e.target.value
    this.setState(stateCopy)
  }
  render(){
    return (
      <div className="UserDialog-Wrapper">
        <div className="UserDialog">
          {
            this.state.selectedTab === 'signInOrSignUp' ?
              <SignInOrSignUp
                formData={this.state.formData}
                onSignIn={this.signIn.bind(this)}
                onSignUp={this.signUp.bind(this)}
                onChange={this.changeFormData.bind(this)}
                onForgotPassword={this.showForgotPassword.bind(this)}
              /> :
            <ForgotPasswordForm
              formData={this.state.formData}
              onSubmit={this.resetPassword.bind(this)}
              onChange={this.changeFormData.bind(this)}
              onSignIn={this.returnToSignIn.bind(this)}
            />
          }
        </div>
      </div>
    )
  }
  showForgotPassword(){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.selectedTab = 'forgotPassword'
    this.setState(stateCopy)
  }
  returnToSignIn(){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.selectedTab = 'signInOrSignUp'
    this.setState(stateCopy)
  }
  resetPassword(e){
    e.preventDefault()
    sendPasswordResetEmail(this.state.formData.email)    
  }
}