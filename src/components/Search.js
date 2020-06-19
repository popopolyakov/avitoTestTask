import React from 'react';
import '../styles/Search.css';


function Search(props) {
    return (
    <div className="searchContainer">
        <form className="searchForm" onSubmit={props.submitForm}>
            <input className='searchForm__input' onChange={props.changeInput} value={props.searchReq} type='text'></input>
            <button className='searchForm__btn' type="submit">Поиск репозиториев</button>
        </form>
    </div>
    );
}

export default Search;
