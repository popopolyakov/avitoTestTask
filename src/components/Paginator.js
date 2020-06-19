import React from 'react';
import {Link} from 'react-router-dom'



import '../styles/Paginator.css';

function Paginator(props) {
  //changePage= (page) =>{props.changePage(page)}

  let pagesArr = (new Array(10)).fill(1).map((a, i) => ++i)
  
  return (
    
    <div className="Pagination">
      <h1>{!!props.searchText ? `Показаны результаты по запросу "${props.searchText}"` : 'Самые популярные репозитории'}</h1>
      <div>
      {props.repos.map((item, i) => (
        <div key={item.id} className="Pagination__block">
          <div className="Pagination__number">
            {((props.page-1)*10)+(i+1)}
          </div>
          <div className="Pagination__name">
            <Link to={`/repository/${item.name}`} onClick={() => { props.openRep(i) }}>{item.name}</Link>
          </div>
          <div className='Pagination_info'>
            <div className="Pagination__stars"> 
              {item.stargazers_count}
            </div>
            <div className="Pagination__lastCommit">
              {item.updated_at.split(/T|Z/)[0] + ' ' + item.updated_at.split(/T|Z/)[1]}
            </div>
            <div className="Pagination__url">
              <a href={item.html_url} rel="noopener noreferrer" target="_blank">Github</a>
            </div>
          </div>
        </div>))}
        </div>
        {props.repos.length < 10 ? (<p>Показаны все найденные репозитории</p>) : (<br></br>)}
        
      {pagesArr.map(item => (<button className="pageBtn" key={item} onClick={() => { props.changePage(item) }}>{item}</button>))}
    </div>
    
  );
}

export default Paginator;
