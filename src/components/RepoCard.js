import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import '../styles/RepoCard.css';
import axios from 'axios';

function RepoCard(props) {
    
    let [repoCard, setRepoCard] = useState({})
    let [ownerInfo, setOwner] = useState({})
    let [languages, setLanguage] = useState([])
    let [contributors, setContributors] = useState([])
    let [lastCommit, setLastCommit] = useState([])
    let [load, setLoad] = useState(false)

    const getInfo=useCallback(async function getInfo(URL) {
        let proxyURL = 'https://cors-anywhere.herokuapp.com/' // Чтобы обойти CORS 
        let config = {
          headers: {
            client_secret: 'd386de61b5265e4478760429610a21b12308babd',
            client_id: 'd386de61b5265e4478760429610a21b12308babd',
            'Access-Control-Allow-Origin': '*'
          },
        }
        console.log(URL)
        let res=await axios.get(proxyURL+URL, config)
        return res.data
      },[])

    useEffect(() => {
        //console.log(props.repo,Object.keys(props.repo).length, !!Object.keys(props.repo).length)
        setLoad(true)
        async function fetchData() {
            console.log(props.repo.languages_url)
            let resLang = await getInfo(props.repo.languages_url)
            setLanguage(Object.keys(resLang))
            console.log(resLang)
            let resContribtors = await getInfo(props.repo.contributors_url)
            console.log(resContribtors)
            let topTenContributers = []
            for (let i = 0; i < 10; i++){
                topTenContributers.push(resContribtors[i].login)
            }
            setContributors(topTenContributers)
            console.log(JSON.stringify(Object.keys(resLang)))
            sessionStorage.languages = JSON.stringify(Object.keys(resLang))
            sessionStorage.contributors = JSON.stringify(topTenContributers)
        }
        if (!languages.length & !contributors.length & !lastCommit.length) {
            
            if (!!Object.keys(props.repo).length) {
                
                sessionStorage.repoCard = JSON.stringify(props.repo)
                setRepoCard(props.repo)
                console.log(props.repo)
                console.log(repoCard);
                
                let [timeCommit, dateCommit] =[props.repo.updated_at.split(/T|Z/)[0], props.repo.updated_at.split(/T|Z/)[1]]
                setLastCommit([timeCommit, dateCommit])
                console.log(lastCommit)
                console.log(props.repo.updated_at);
                
                sessionStorage.owner = JSON.stringify(props.repo.owner)
                sessionStorage.lastCommit = JSON.stringify([timeCommit, dateCommit])
                setOwner(props.repo.owner)
                
            } else {
                setRepoCard(JSON.parse(sessionStorage.repoCard))
                setOwner(JSON.parse(sessionStorage.owner))
                setLanguage(JSON.parse(sessionStorage.languages))
                setLastCommit(JSON.parse(sessionStorage.lastCommit))
                setContributors(JSON.parse(sessionStorage.contributors))
            }
            if (!!props.repo.languages_url & !!props.repo.contributors_url) fetchData()
        }
        setLoad(false)
    }, [setLoad, lastCommit, repoCard,setOwner,setLanguage,setContributors,setLastCommit, props.repo, setRepoCard, getInfo,repoCard.languages_url, repoCard.contributors_url, languages.length, contributors.length]);

    return (
        <div className="RepoCard">
            <div><h3><Link to='/'>Назад</Link></h3></div>
            <div className="RepoCard__mainInfo">
                    <div className='RepoCard__repoInfo'>
                        <h1>{repoCard.name}</h1>
                        <p>Stars: {repoCard.stargazers_count}</p>
                        <p>Последний коммит в {lastCommit[0]}   {lastCommit[1]}</p>
                    </div>
                <div className='RepoCard__ownerInfo'>
                        <h3>Автор: <a href={ownerInfo.html_url}>{ownerInfo.login}</a></h3>
                        <img className='RepoCard__ownerImg' alt="Фото владельца репозитория" src={ownerInfo.avatar_url}></img>
                    </div>
            </div>
            <div className='RepoCard__description'>
                <p><b>Используемые языки: </b>{load ? (<span>Загрузка</span>) : !!languages.length ? languages.map((item, i) => <span key={item}>{`${item}${i === languages.length-1 ? '' : ','}  `}</span>): 'Никакой из языков программирования не использовался'}</p>
                <p><b>Краткое описание репозитория: </b>{repoCard.description}</p>
                <p><b>10 активных контрибьюторов: </b>{load ? (<span>Загрузка</span>): contributors.map((item, i) => <span key={item}>{`${item}${i === 9 ? '' : ','}  `}</span>)}</p>
            </div>
        </div>
    );
}

export default RepoCard;