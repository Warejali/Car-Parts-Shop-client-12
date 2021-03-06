import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import Loading from '../Shared/Loading';

const ManageOrders = () => {
    const { data: orders, isLoading, refetch } = useQuery('orders', () => fetch('https://pacific-eyrie-12324.herokuapp.com/orders', {
        method: 'GET',
        headers: {
            authorization: ` Bearer ${localStorage.getItem('accessToken')}`
        }
    }).then(res => res.json()))
    if (isLoading) {
        return <Loading></Loading>
    }
    return (
        <div>
            <h2 className='text-2xl text-primary font-bold py-2'>Total orders {orders.length}</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">

                    <thead>
                        <tr>
                            <th>Serial</th>
                            <th>Product Name</th>
                            <th>Total Price</th>
                            <th>Quantity</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order, index) =>
                                <tr>
                                    <th className='border'>{index + 1}</th>
                                    <td className='border'>{order.product}</td>
                                    <td className='border'>${order.price}</td>
                                    <td className='border'>{order.orderQuantity}</td>
                                    <td className='border bg-red-100'>{(order.price && !order.paid) && <Link to={`/dashboard/payment/${order._id}`}><button className='font-bold'>Not Paid</button></Link>}
                                        {(order.price && order.paid) && <span className=' font-bold'>Paid</span>}

                                    </td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;