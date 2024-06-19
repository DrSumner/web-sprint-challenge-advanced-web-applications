import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'
const initialFormValues = { title: '', text: '', topic: '' }

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState({title: '', text: '', topic: ''})
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/')}
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setMessage('Goodbye!')
    localStorage.removeItem('token')
    redirectToLogin()
  }

  const login = async ( {username, password} ) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage(''); setSpinnerOn(true)
    try{ 
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": username, "password": password })
        
      });

      if(!res.ok){throw new Error(res.status)}
      const data = await res.json()
      localStorage.setItem('token', data.token); redirectToArticles(); 
      setSpinnerOn(false); 
    }catch(err){
      console.log(err)
    }
  }

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    
    setMessage(''); setSpinnerOn(true)
    try{
      const res = await fetch(articlesUrl, {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }); if(!res.ok){const errData = await res.json() ;
        throw {status: res.status, message: errData.message}}
       const data = await res.json(); console.log(data.articles); if(articles.length === 0){setMessage(data.message)}
       setArticles(data.articles); setSpinnerOn(false); 
    }catch(err){
      console.log(err); setSpinnerOn(false)
      if(err.status == 401){redirectToLogin(), setMessage(err.message)}
    }
  }

  const postArticle = async article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage(''); setSpinnerOn(true)
    try{
      const res = await fetch(articlesUrl, {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({
          title: article.title,
          text:article.text,
          topic: article.topic,})
      }); if(!res.ok){throw new Error(res.status)} setCurrentArticleId(initialFormValues); 
      setSpinnerOn(false); getArticles()
      const data = await res.json()
      setMessage(data.message)
    }catch(err){
      console.log(err); setSpinnerOn(false)
    } 

  }

  const updateArticle = async ( article_id, article ) => {
    // ✨ implement
    // You got this!
    setMessage(''); setSpinnerOn(true); console.log(currentArticleId)
     try{
      const res = await fetch(`${articlesUrl}/${currentArticleId.article_id}`, {
        method: 'PUT',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: article.title,
          text:article.text,
          topic: article.topic,})
      }); if(!res.ok){throw new Error(res.status)} 
      setCurrentArticleId(initialFormValues); setSpinnerOn(false);
      getArticles();  const data = await res.json()
      setMessage(data.message)
    }catch(err){
      console.log(err); setSpinnerOn(false)
    }
    
    
  }

  const deleteArticle = async article_id => {
    // ✨ implement
    setSpinnerOn(true)
    try{
      const res = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }); if(!res.ok){throw new Error(res.status)} await getArticles(); 
      setSpinnerOn(false); const data = await res.json(); setMessage(data.message)
    }catch(err){
      console.log(err); setSpinnerOn(false)
    }
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm setCurrentArticleId={setCurrentArticleId} updateArticle={updateArticle} currentArticleId={currentArticleId} postArticle={postArticle} articles={articles} />
              <Articles  setCurrentArticleId={setCurrentArticleId} getArticles={getArticles} articles={articles} deleteArticle={deleteArticle} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
