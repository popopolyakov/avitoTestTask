import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import '../styles/RepoCard.css';
import axios from 'axios';
import { withRouter } from "react-router";

function RepoCardDef(props) {
    
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
        let res = await axios.get(proxyURL + URL, config)
        console.log(res.data)
        return res.data
      },[])
    
    useEffect(() => {
        //console.log(props.repo,Object.keys(props.repo).length, !!Object.keys(props.repo).length)
        setLoad(true)
        async function fetchData(rep) {
            console.log(rep.languages_url)
            let resLang = await getInfo(rep.languages_url)
            setLanguage(Object.keys(resLang))
            console.log(resLang)
            let resContributors = await getInfo(rep.contributors_url)
            console.log(resContributors)
            let topTenContributers = []
            console.log(resContributors)
            if (!!resContributors.length) {
                topTenContributers = (new Array(resContributors.length > 10 ? 10 : resContributors.length)).fill('').map((contributor, i) =>  resContributors[i].login )
            }
            setContributors(topTenContributers)
            console.log(JSON.stringify(Object.keys(resLang)))
            sessionStorage.languages = JSON.stringify(Object.keys(resLang))
            sessionStorage.contributors = JSON.stringify(topTenContributers)
        }
        async function getRepInfo() {
            const { match } = props
            let resRep = await getInfo(`https://api.github.com/repos/${match.params.repOwner}/${match.params.name}`)
            console.log(resRep)
            sessionStorage.repoCard = JSON.stringify(resRep)
            setRepoCard(resRep)
            let [timeCommit, dateCommit] =[resRep.updated_at.split(/T|Z/)[0], resRep.updated_at.split(/T|Z/)[1]]
            setLastCommit([timeCommit, dateCommit])
            sessionStorage.owner = JSON.stringify(resRep.owner)
            sessionStorage.lastCommit = JSON.stringify([timeCommit, dateCommit])
            setOwner(resRep.owner)

            await fetchData(resRep)
        }
        console.log(props.RepoCard)
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
                    if (!!sessionStorage.repoCard & !!sessionStorage.owner & !!sessionStorage.languages & !!sessionStorage.lastCommit & !!sessionStorage.contributors) {
                        setRepoCard(JSON.parse(sessionStorage.repoCard))
                        setOwner(JSON.parse(sessionStorage.owner))
                        setLanguage(JSON.parse(sessionStorage.languages))
                        setLastCommit(JSON.parse(sessionStorage.lastCommit))
                        setContributors(JSON.parse(sessionStorage.contributors))
                    } else {                
                        getRepInfo()
                    }
                }
                if (!!props.repo.languages_url & !!props.repo.contributors_url) fetchData(props.repo)
            }
        setLoad(false)
    }, [props, setLoad, lastCommit, repoCard,setOwner,setLanguage,setContributors,setLastCommit, props.repo, setRepoCard, getInfo, languages.length, contributors.length]);

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
                        <h3>Автор: <a href={ownerInfo.html_url} rel="noopener noreferrer" target='_blank'>{ownerInfo.login}</a></h3>
                    {!!load ? 'Загрузка' : <img className='RepoCard__ownerImg' alt="Фото владельца репозитория" src={ownerInfo.avatar_url}></img>}
                    </div>
            </div>
            <div className='RepoCard__description'>
                <p><b>Используемые языки: </b>{!!load ? (<span>Загрузка</span>) : !!languages.length ? languages.map((item, i) => <span key={item}>{`${item}${i === languages.length-1 ? '' : ','}  `}</span>): 'Никакой из языков программирования не использовался'}</p>
                <p><b>Краткое описание репозитория: </b>{!!repoCard.description ? repoCard.description : 'Описания нет'}</p>
                <p><b>10 активных контрибьюторов: </b>{!!load ? (<span>Загрузка</span>): !!contributors.length ? contributors.map((item, i) => <span key={item}>{`${item}${i === contributors.length-1 ? i===9? '' : ' (это был последний из Contributor\'ов)' : ','}  `}</span>) : 'Нет активных контрибьюторов'}</p>
            </div>
        </div>
    );
}

export default withRouter(RepoCardDef);