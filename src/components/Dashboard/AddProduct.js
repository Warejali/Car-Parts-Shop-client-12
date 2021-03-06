import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import auth from '../../firebase.init';
import Loading from '../Shared/Loading';

const AddProduct = () => {
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const [user] = useAuthState(auth);
    const email = user?.email

    const { data: products, isLoading, refetch } = useQuery('services', () => fetch('https://pacific-eyrie-12324.herokuapp.com/product').then(res => res.json()))

    const imageStorageKey = '100d68a470e46ca6b971169172b3b2a5';

    const onSubmit = async data => {
        const image = data.image[0];
        const formData = new FormData();
        formData.append('image', image);
        const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    const img = result.data.url;
                    const product = {
                        name: data.name,
                        description: data.description,
                        email: data.email,
                        price: data.price,
                        img: img,
                        minQuantity: data.minQuantity,
                        quantity: data.quantity
                    }
                    // send to db 
                    fetch('https://pacific-eyrie-12324.herokuapp.com/product', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        },
                        body: JSON.stringify(product)
                    })
                        .then(res => res.json())
                        .then(inserted => {
                            if (inserted.insertedId) {
                                toast.success('Product added successfully')
                                reset();
                            }
                            else {
                                toast.error('Failed to add the Product');
                            }
                        })

                }

            })
    }

    if (isLoading) {
        return <Loading></Loading>
    }

    return (
        <div className='lg:mx-16 mx-4 mb-20'>
            <h2 className="text-2xl my-4">Add a New Product</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="form-control w-full ">
                    <input
                        type="email"
                        value={email}
                        className="input input-bordered w-full"
                        {...register("email", {
                            required: {
                                value: true,
                                message: 'Email is Required'
                            },
                            pattern: {
                                value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                message: 'Provide a valid Email'
                            }
                        })}
                    />
                    <label className="label">
                        {errors.email?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                        {errors.email?.type === 'pattern' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                    </label>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Product Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="input input-bordered w-full"
                        {...register("name", {
                            required: {
                                value: true,
                                message: 'Name is Required'
                            }
                        })}
                    />
                    <label className="label">
                        {errors.name?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                    </label>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Product description</span>
                    </label>
                    <textarea
                        type="text"
                        placeholder="Product description"
                        className=" input-bordered w-full textarea"
                        {...register("description", {
                            required: {
                                value: true,
                                message: 'description is Required'
                            }
                        })}
                    />
                    <label className="label">
                        {errors.description?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                    </label>
                </div>

                <div className='lg:flex gap-10'>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Price</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Price"
                            className="input input-bordered w-full"
                            {...register("price", {
                                required: {
                                    value: true,
                                    message: 'price is Required'
                                }
                            })}
                        />
                        <label className="label">
                            {errors.price?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                        </label>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Quantity</span>
                        </label>
                        <input
                            type="number"
                            placeholder="quantity"
                            className="input input-bordered w-full"
                            {...register("quantity", {
                                required: {
                                    value: true,
                                    message: 'quantity is Required'
                                }
                            })}
                        />
                        <label className="label">
                            {errors.quantity?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                        </label>
                    </div>
                </div>

                <div className='lg:flex gap-10'>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Minimum Order</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Minimum Order"
                            className="input input-bordered w-full"
                            {...register("minQuantity", {
                                required: {
                                    value: true,
                                    message: 'minQuantity is Required'
                                }
                            })}
                        />
                        <label className="label">
                            {errors.minQuantity?.type === 'minQuantity' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                        </label>
                    </div>



                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Photo</span>
                        </label>
                        <input
                            type="file"
                            className="input input-bordered w-full"
                            {...register("image", {
                                required: {
                                    value: true,
                                    message: 'Image is Required'
                                }
                            })}
                        />
                        <label className="label">
                            {errors.name?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                        </label>
                    </div>
                </div>

                <input className='btn btn-primary w-full max-w-xs text-white' type="submit" value="Add product" />
            </form>
        </div>
    );
};

export default AddProduct;