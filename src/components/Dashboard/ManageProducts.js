import React from 'react';
import { useQuery } from 'react-query';
import Loading from '../Shared/Loading';
import ManageProduct from './ManageProduct';

const ManageProducts = () => {

    const { data: products, isLoading, refetch } = useQuery('products', () => fetch('https://pacific-eyrie-12324.herokuapp.com/product').then(res => res.json()))

    if (isLoading) {
        return <Loading></Loading>
    }

    return (
        <div>
            <h2 className='text-3xl text-accent p-5'>Total Products: {products.length}</h2>
            {
                products.map(product => <ManageProduct product={product} refetch={refetch}></ManageProduct>)
            }

        </div>
    );
};

export default ManageProducts;