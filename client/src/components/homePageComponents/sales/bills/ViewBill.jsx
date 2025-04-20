/* eslint-disable react/prop-types */
import React from 'react';
import Logo from '../../../Logo';
// import { useSelector } from 'react-redux';

// ViewBill component wrapped in forwardRef
const ViewBill = React.forwardRef((props, ref) => {

    const bill = props.bill;

    const exemptedParagraph = bill?.BusinessId?.exemptedParagraph?.split('۔')

    return bill && (
        <div className=' h-[28rem] shadow-lg overflow-y-auto scrollbar-thin'>
            <div ref={ref} className="view-bill p-4 pt-8 bg-white" >
                {/* Business Information */}
                <div className="flex justify-center">

                    <div className='text-center'>
                        <h2 className="text-2xl font-bold pb-2">{bill?.BusinessId?.businessName}</h2>
                        <p className="text-sm">{bill?.storeAddress}</p>
                        <p className="text-sm">Phone &#128382;: {bill?.BusinessId?.owner?.mobileno} | Email &#128231;: {bill?.BusinessId?.owner?.email}</p>
                        <h3 className="text-xl font-bold mt-4">Sale Invoice</h3>
                    </div>
                    <div></div>
                </div>

                <div className='w-full flex justify-center'><div className='border-b-2 my-5 w-4/5'></div></div>

                {/* Invoice and Customer Information */}
                <div className="flex justify-between mb-4">
                    {/* Customer Info */}
                    <div className="text-left">
                        <p className='font-semibold'><strong className='font-bold'>Customer Name:</strong> {bill?.customer?.customerName}</p>
                        <p className='font-semibold'><strong className='font-bold'>NTN:</strong> {bill?.customer?.ntnNumber}</p>
                        <p className='font-semibold'><strong className='font-bold'>Mobile Number:</strong> {bill?.customer?.mobileNo}</p>
                        <p className='font-semibold'><strong className='font-bold'>Address:</strong> {bill?.customer?.customerRegion}</p>
                    </div>
                    {/* Invoice Info */}
                    <div className=''>
                        <div className="text-left">
                            <p className='font-semibold'>Invoice No: <strong className='pr-1 font-bold'>{bill?.billNo}</strong> </p>
                            <p><strong className='pr-1'>Date:</strong>{
                                bill?.createdAt &&
                                new Date(bill?.createdAt).toLocaleString("en-PK", {
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
                </div>
                {/* Items Section */}
                <div className="my-6">
                    <table className="w-full border">
                        <thead className="border-2">
                            <tr>
                                <th className="text-xs text-left p-2">No.</th>
                                <th className="text-xs text-left p-2">Item Name</th>
                                <th className="text-xs text-left p-2">Company</th>
                                <th className="text-xs text-left p-2">Qty</th>
                                <th className="text-xs text-left p-2">Rate</th>
                                <th className="text-xs text-left p-2">Gross Am.</th>
                                <th className="text-xs text-left p-2">Extra Disc.</th>
                                <th className="text-xs text-left p-2">Net Am.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render rows dynamically based on data */}
                            {bill?.billItems && bill?.billItems.map((item, index) => (
                                <tr key={index} className="break-inside-avoid border-2">
                                    <td className="text-xs p-2">{index + 1}</td>
                                    <td className="text-xs p-2">{item.productId.productName}</td>
                                    <td className="text-xs p-2">{item.productId?.companyId?.companyName}</td>
                                    <td className="text-xs p-2">{item.quantity}</td>
                                    <td className="text-xs p-2">{item.billItemPrice}</td>
                                    <td className="text-xs p-2">{item.quantity * item.billItemPrice}</td>
                                    <td className="text-xs p-2">{item.billItemDiscount}</td>
                                    <td className="text-xs p-2">{(item.quantity * item.billItemPrice) - ((item.quantity * item.billItemPrice) * item.billItemDiscount / 100)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Totals Section */}
                <div className='flex  justify-end'>
                    <div className=" mb-4 text-l w-5/12">
                        <p className='font-semibold'><span className='inline-block font-medium w-44'>Total Gross Amount:</span> {bill && (bill.totalAmount).toFixed(2)}</p>
                        <p className='font-semibold'><span className='inline-block font-medium w-44'>Discount Amount:</span> {bill && (bill.flatDiscount).toFixed(2)}</p>
                        <p className='font-semibold'><span className='inline-block font-medium w-44'>Paid Amount:</span> {bill && (bill.paidAmount).toFixed(2)}</p>
                        <p className='font-bold'><span className='inline-block font-medium w-44'>Bill Balance:</span> {bill && (bill?.totalAmount - bill?.flatDiscount - bill?.paidAmount).toFixed(2)}</p>
                    </div>
                </div>
                {/* Signature Section */}
                <div className=''>
                    {
                        props.exemptedParagraph &&
                        <div className="text-justify mt-4 text-[10px] pb-5">
                            <h4 className='text-right mr-4 text-[12px] py-2 font-bold'>:ضروری ہدایات</h4>
                            <ul>
                                {exemptedParagraph?.map((paragraph, i) => (
                                    paragraph.length > 3 &&
                                    <li key={i} className='text-right flex flex-row-reverse gap-1 py-1'> <span>&#8592;</span> <span>{paragraph}</span></li>
                                ))}
                            </ul>
                        </div>
                    }
                    <div className='flex items-end justify-end gap-20'>
                        <p className='text-center text-[10px]'>Software by Pandas. 📞 03103480229 🌐 www.pandas.com.pk</p>
                        <div className="text-right mt-16 mr-24">
                            <p>____________________________</p>
                            <p className='mr-4'>Signature & Stamp</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Add displayName for better debugging
ViewBill.displayName = 'ViewBill';

export default ViewBill;
