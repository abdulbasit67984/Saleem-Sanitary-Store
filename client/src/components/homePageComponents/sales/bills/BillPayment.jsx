/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../../../features/config';
import Loader from '../../../../pages/Loader';
import Button from '../../../Button';

function BillPayment() {
    const { billId } = useParams();
    const [amountPaid, setAmountPaid] = useState(0);
    const [bill, setBill] = useState(null);
    const [flatDiscount, setFlatDiscount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBill() {
            setIsLoading(true);
            try {
                const response = await config.fetchSingleBill(billId);
                if (response) {
                    setBill(response.data);
                    console.log(response)
                }
            } catch (error) {
                console.error('Error fetching bill:', error);
            } finally {
                setIsLoading(false);
            }
        }
        if (billId) fetchBill();
    }, [billId, ]);

    const handlePaymentSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await config.billPayment({ billId, amountPaid, flatDiscount });
            console.log('Payment successful:', response);
            if (response) {
                setBill(response.data.bill)
                alert('Payment added Successfully');
                // navigate('/sales/view-bills');
            }
            setAmountPaid(0)
            setFlatDiscount(0)
            setIsLoading(false);
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed');
        } finally {
            setIsLoading(false);
        }
    };

    return !isLoading ? (
        <div className="p-4 bg-white border rounded shadow-md text-xs">
            <h2 className="text-lg font-bold mb-4">Bill Payment for Bill #{billId}</h2>
            {bill && (
                <div className="mb-4 text-sm flex flex-col gap-1">
                    <p><strong>Customer Name:</strong> {bill.customer?.customerName}</p>
                    <p><strong>Total Amount Due:</strong> {bill.totalAmount - bill.paidAmount - bill.flatDiscount}</p>
                    <p><strong>Total Flat Discount:</strong> {bill.flatDiscount}</p>
                </div>
            )}
            <div className="mb-4">
                <label className="block mb-1">Amount to Pay:</label>
                <input
                    type="number"
                    className="border p-2 rounded w-full"
                    value={parseFloat(amountPaid)}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
                    placeholder="Enter Amount"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Flat Discount:</label>
                <input
                    type="number"
                    className="border p-2 rounded w-full"
                    value={parseFloat(flatDiscount)}
                    onChange={(e) => setFlatDiscount(parseFloat(e.target.value))}
                    placeholder="Enter Amount"
                />
            </div>
            <Button
                className="bg-green-600 hover:bg-green-800 text-white p-2 rounded"
                onClick={handlePaymentSubmit}
            >
                Submit Payment
            </Button>
        </div>
    )
        : <Loader h_w='w-16 h-16 border-b-4 border-t-4' message='bill saving....' />
}

export default BillPayment;
