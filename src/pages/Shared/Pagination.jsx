import React from 'react';

const Pagination = ({currentPage, setCurrentPage, totalPages}) => {
    
    const pageNumbers = [...Array(totalPages).keys()].map(number => number + 1);
    console.log(currentPage,setCurrentPage,totalPages)

    return (
        <div className="flex justify-center gap-2 mt-8">
            <button className="btn btn-sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} > Prev </button>
            {
                pageNumbers.map(page => (<button key={page} onClick={() => setCurrentPage(page)} className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline"}`} > {page} </button>))
            }
            <button className="btn btn-sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} > Next </button>
        </div>
    );
};

export default Pagination;