import React from 'react';
import { useForm } from 'react-hook-form';

const OpeningBalance = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
      <div className="flex items-center">
        <label className="w-24">Account ID:</label>
        <input
          type="text"
          {...register('accountId', { required: true })}
          className="border p-1 rounded w-full text-sm"
        />
        {errors.accountId && <span className="text-red-500 text-xs">Account ID is required</span>}
      </div>

      <div className="flex items-center">
        <label className="w-24">Opening Balance:</label>
        <input
          type="number"
          {...register('openingBalance', { required: true, min: 0 })}
          className="border p-1 rounded w-full text-sm"
        />
        {errors.openingBalance && <span className="text-red-500 text-xs">Opening Balance is required</span>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2">
        Submit
      </button>
    </form>
  );
};

export default OpeningBalance;
