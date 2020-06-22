import React, { useState, useEffect, useCallback } from 'react';
import Search from './Search'
import Paginator from './Paginator'
import '../styles/App.css';
import axios from 'axios';

function Main(props) {
  let [searchReq, setSearchReq] = useState(''/* !!sessionStorage.search ? sessionStorage.search  :'' */)
  let [repos, setRepos] = useState([])
  let [load, setLoad] = useState(false)
  let [page, setPage] = useState(!!sessionStorage.page ? sessionStorage.page : 1)
  let [curSearch, setCurSearch] = useState('')


  function changeInput(e) {
    console.log(e.target.value)
    setSearchReq(e.target.value)
    sessionStorage.search = e.target.value
  }
  
  const getRepos=useCallback(async function getRepos(searchText = '', page='1') {
    let proxyURL = 'https://cors-anywhere.herokuapp.com/' // Чтобы обойти CORS 
    let searchURL = `https://api.github.com/search/repositories`
    let config = {
      headers: {
        client_secret: 'd386de61b5265e4478760429610a21b12308babd',
        client_id: 'd386de61b5265e4478760429610a21b12308babd',
        'Access-Control-Allow-Origin': '*'
      },
      params: {
        l: '',
        o: 'desc',
        q: !!searchText ? searchText : 'stars:>0',
        sort: 'stars',
        per_page: '10',
        page: page
      },
    }
    let res=await axios.get(proxyURL+searchURL, config)
    console.log(res.data)
    return res.data.items
  },[])

  async function searchRepos(e) {
    e.preventDefault()
    setLoad(true)
    if (searchReq === '') {
      delete sessionStorage.search
      delete sessionStorage.searchedRepos
    } else {
      sessionStorage.search = searchReq
    }
    sessionStorage.page = 1
    setPage(1)
    console.log(e)
    let reposList = await getRepos(searchReq)
    setRepos(reposList)
    sessionStorage.searchedRepos = JSON.stringify(reposList)
    setCurSearch(searchReq)
    sessionStorage.curSearch=searchReq
    setLoad(false)
  }

  async function changePage(e) {
    setLoad(true)
    setPage(e)
    if (sessionStorage.page!==e) {
      console.log(e, 'event страницы', searchReq, 'запрос поиска')
      let reposList = await getRepos(!!sessionStorage.curSearch ? sessionStorage.curSearch : searchReq,e)
      setRepos(reposList)
      console.log(page)
      sessionStorage.page = e
      sessionStorage.searchedRepos=JSON.stringify(reposList)
    } else {
      setRepos(JSON.parse(sessionStorage.searchedRepos))
      setPage(sessionStorage.page)
    }
    setLoad(false)
  }

  useEffect(() => {
    async function fetchData() {
      if (!sessionStorage.searchedRepos) {
        if (!sessionStorage.popular) {
          if (!repos.length) {
            setLoad(true)
            console.log(!searchReq)
            if (!searchReq) {
              let reposList = await getRepos()
              setRepos(reposList)
              console.log(reposList)
              sessionStorage.popular = JSON.stringify(reposList)
            }
          }
          setLoad(false)
        } else {
          setRepos(JSON.parse(sessionStorage.popular))
        }
      } else {
        setRepos(JSON.parse(sessionStorage.searchedRepos))
        setCurSearch(sessionStorage.curSearch)
      }
    }
    fetchData()
  },[getRepos,repos.length,searchReq]);

  function openRep(i) {
    console.log('what')
    let item=repos[i]
    props.openRep(item)
  }

  return (

    <div className="Main">
      <header className="Main-header">
        <Search searchReq={searchReq} changeInput={changeInput} submitForm={searchRepos}></Search>
      </header>
      
      <main className="Main-main">
        {load ? (<p>Гружу</p>) : (<Paginator repos={repos} page={page} changePage={changePage} openRep={openRep} searchText={curSearch}></Paginator>)}
      </main>
    </div>

  );
}

export default Main;
