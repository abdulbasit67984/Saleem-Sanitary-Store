/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import authService from '../../../features/auth';

const ViewPurchase = (bill, isOpen, onClose) => {
    const [userData, setUserData] = useState({})

    const fetchUser = async () => {
        const response = await authService.getCurrentUser()
        if(response){
            setUserData(response.data)
            console.log('response.data', response.data)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (!isOpen) return null;
    const purchase = bill.bill;
    console.log('purchase', purchase)
    return purchase && (
        <div className='h-[28rem] shadow-lg overflow-y-auto scrollbar-thin'>
            <div className="view-bill p-4 pt-8 bg-white">
                {/* Business Information */}
                <div className="flex justify-center">
                    <div className='text-center'>
                        <h2 className="text-2xl font-bold pb-2">{userData?.BusinessId?.businessName}</h2>
                        <p className="text-sm">{userData?.BusinessId?.businessRegion}</p>
                        <p className="text-sm">Phone &#128382;: {userData.mobileno} | Email &#128231;: {userData.email}</p>
                        <h3 className="text-xl font-bold mt-4">Purchase Invoice</h3>
                    </div>
                </div>

                <div className='w-full flex justify-center'><div className='border-b-2 my-5 w-4/5'></div></div>

                {/* Invoice and Vendor Information */}
                <div className="flex justify-between mb-4">
                    {/* Vendor Info */}
                    <div className="text-left">
                        <p><strong>Vendor Name:</strong> {purchase.vendorSupplierId?.supplierName || purchase.vendorCompanyId?.companyName}</p>
                        <p><strong>NTN:</strong> {purchase.vendorSupplierId?.ntnNumber || purchase.vendorCompanyId?.ntnNumber}</p>
                        <p><strong>Phone Number:</strong> {purchase.vendorSupplierId?.mobileNo || purchase.vendorCompanyId?.mobileNo}</p>
                        <p><strong>Address:</strong> {purchase.vendorSupplierId?.supplierRegion || purchase.vendorCompanyId?.companyRegion}</p>
                    </div>
                    {/* Invoice Info */}
                    <div className='text-left'>
                        <p><strong className='pr-1'>Invoice No:</strong> {purchase.purchaseBillNo}</p>
                        <p><strong className='pr-1'>Date:</strong>{
                            purchase.createdAt &&
                            new Date(purchase.createdAt).toLocaleString("en-PK", {
                                timeZone: "Asia/Karachi",
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                            })
                        }</p>
                    </div>
                </div>

                {/* Items Section */}
                <div className="my-6">
                    <table className="w-full border">
                        <thead className="border-2">
                            <tr>
                                <th className="text-xs text-left p-2">Sr No.</th>
                                <th className="text-xs text-left p-2">Item Name</th>
                                <th className="text-xs text-left p-2">Qty</th>
                                <th className="text-xs text-left p-2">Rate</th>
                                <th className="text-xs text-left p-2">Gross Amount</th>
                                <th className="text-xs text-left p-2">Discount</th>
                                <th className="text-xs text-left p-2">Net Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchase.purchaseItems && purchase.purchaseItems.map((item, index) => (
                                <tr key={index} className="break-inside-avoid">
                                    <td className="text-xs p-2">{index + 1}</td>
                                    <td className="text-xs p-2">{item.productId.productName}</td>
                                    <td className="text-xs p-2">{item.quantity}</td>
                                    <td className="text-xs p-2">{item.pricePerUnit}</td>
                                    <td className="text-xs p-2">{item.quantity * item.pricePerUnit}</td>
                                    <td className="text-xs p-2">{item.discount}</td>
                                    <td className="text-xs p-2">{(item.quantity * item.pricePerUnit) - ((item.quantity * item.pricePerUnit) * item.discount / 100)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className='flex justify-end'>
                    <div className="mb-4 w-72">
                        <p><span className='inline-block font-semibold w-44'>Total Gross Amount:</span> {(purchase.totalAmount).toFixed(2)}</p>
                        <p><span className='inline-block font-semibold w-44'>Discount Amount:</span> {(purchase.flatDiscount).toFixed(2)}</p>
                       
                        <p><span className='inline-block font-semibold w-44'>Net Total:</span> {(purchase.totalAmount).toFixed(2)}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Add displayName for better debugging
ViewPurchase.displayName = 'ViewPurchase';

export default ViewPurchase;
