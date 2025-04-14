import '../main.css'
import './CatalogPage.css'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import Catalog from '../HomePage/Сatalog'


export default function CatalogPage() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    return (
        <>
            <section className='catalogpage'>
                <div className="container">
                    <div className="catalogpage-inner">
                        <div className='navigation'>
                            <Link to='/Главная'>Главная</Link>
                            <span>/</span>
                            <Link to='/Каталог'>Каталог</Link>
                        </div>


                        

                        <Catalog searchQuery={searchQuery} />

                    </div>
                </div>
            </section>
        </>
    )
}