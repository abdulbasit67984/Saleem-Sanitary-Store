/* eslint-disable react/prop-types */
import React from 'react';
import Logo from '../../../Logo';
import commonFunction from '../../../../features/functions';
// import { useSelector } from 'react-redux';

// ViewBill component wrapped in forwardRef
const ViewBill = React.forwardRef((props, ref) => {

    const bill = props.bill;
    const packingSlip = props.packingSlip
    const previousBalance = props.previousBalance
    const showPreviousBalance = props.showPreviousBalance

    const exemptedParagraph = bill?.BusinessId?.exemptedParagraph?.split('۔')

    return bill && (
        <div className=' h-[28rem] shadow-lg overflow-y-auto scrollbar-thin'>
            <div ref={ref} className="view-bill p-4 pt-8 bg-white" >
                {/* Business Information */}
                <div className="flex justify-center">

                    <div className='text-center'>
                        <h2 className="text-2xl font-bold pb-2">{bill?.BusinessId?.businessName}</h2>
                        <p className="text-sm">{bill?.storeAddress}</p>
                        <p className="text-sm"><span className='font-bold'>Phone</span> &#128382;: {bill?.BusinessId?.owner?.mobileno?.map((num, i) => <span className='px-1' key={i}>{num}</span>)} | <span className='font-bold'>Address</span> &#10003;: {bill?.BusinessId?.businessRegion}</p>
                        <h3 className="text-xl font-bold mt-4">{packingSlip ? 'Packing Slip' : 'Sale Invoice'}</h3>
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
                                {
                                    !packingSlip && <th className="text-xs text-left p-2">Rate</th>}
                                {
                                    !packingSlip && <th className="text-xs text-left p-2">Gross Am.</th>}
                                {
                                    !packingSlip &&
                                    <th className="text-xs text-left p-2">Extra Disc.</th>
                                }
                                {
                                    !packingSlip &&
                                    <th className="text-xs text-left p-2">Net Am.</th>
                                }                    </tr>
                        </thead>
                        <tbody>
                            {bill?.billItems && bill?.billItems.map((item, index) => (
                                <tr key={index} className="break-inside-avoid border-2">
                                    <td className="text-xs p-2">{index + 1}</td>
                                    <td className="text-xs p-2">{commonFunction.truncateString(item.productId.productName, 23)}</td>
                                    <td className="text-xs p-2">{commonFunction.truncateString(item.productId?.companyId?.companyName, 13)}</td>
                                    <td className="text-xs p-2">{item.quantity}</td>
                                    {!packingSlip &&
                                        <td className="text-xs p-2">{commonFunction.formatAsianNumber(item.billItemPrice)}</td>
                                    }
                                    {!packingSlip &&
                                        <td className="text-xs p-2">{commonFunction.formatAsianNumber(item.quantity * item.billItemPrice)}</td>
                                    }
                                    {!packingSlip &&
                                        <td className="text-xs p-2">{commonFunction.formatAsianNumber(item.billItemDiscount)}</td>
                                    }
                                    {!packingSlip &&
                                        <td className="text-xs p-2">{commonFunction.formatAsianNumber((item.quantity * item.billItemPrice) - ((item.quantity * item.billItemPrice) * item.billItemDiscount / 100))}</td>
                                    }
                                </tr>
                            ))}

                            {bill.extraItems && bill.extraItems.map((item, index) => (
                                <tr key={index} className="text-xs break-inside-avoid border-2">
                                    <td className="text-xs p-2">{bill?.billItems.length + index + 1}</td>
                                    <td className="text-xs p-2">{commonFunction.truncateString(item.itemName, 16)}</td>
                                    <td className="text-xs p-2"></td>
                                    <td className="text-xs p-2">{item.quantity}</td>
                                    {!packingSlip && <td className="text-xs p-2">{commonFunction.formatAsianNumber(item.salePrice)}</td>}
                                    {!packingSlip && <td className="text-xs p-2">
                                        {commonFunction.formatAsianNumber((item.quantity * item.salePrice))}
                                    </td>}
                                    <td className="text-xs p-2"></td>
                                    {!packingSlip &&
                                        <td className="text-xs p-2">{commonFunction.formatAsianNumber((item.quantity * item.salePrice))}</td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Totals Section */}
                {!packingSlip &&
                    <div className='flex  justify-end'>
                        <div className=" mb-4 text-l w-5/12">
                            <p className='font-semibold'><span className='inline-block font-medium w-44'>Total Gross Amount:</span> {bill && commonFunction.formatAsianNumber(bill.totalAmount)}</p>
                            <p className='font-semibold'><span className='inline-block font-medium w-44'>Discount Amount:</span> {bill && commonFunction.formatAsianNumber(bill.flatDiscount)}</p>
                            <p className='font-semibold'><span className='inline-block font-medium w-44'>Paid Amount:</span> {bill && commonFunction.formatAsianNumber(bill.paidAmount)}</p>
                            <p className='font-bold'><span className='inline-block font-medium w-44'>Bill Balance:</span> {bill && commonFunction.formatAsianNumber(bill?.totalAmount - bill?.flatDiscount - bill?.paidAmount)}</p>
                            {showPreviousBalance && <p className='font-bold'><span className='inline-block font-medium w-44'>Previous Balance:</span><span className='underline'> {previousBalance && commonFunction.formatAsianNumber(previousBalance - (bill?.totalAmount - bill?.flatDiscount - bill?.paidAmount))}</span></p>}
                            {showPreviousBalance && <p className='font-bold'><span className='inline-block font-medium w-44'>Total Balance:</span> {previousBalance && commonFunction.formatAsianNumber(previousBalance)}</p>}
                        </div>
                    </div>
                }

                {!packingSlip &&
                    <div className='mt-3'>
                        <p className='text-[12px] text-right'>نوٹ:  کوئی بھی آئیٹم واپس یا تبدیل ہو سکتی ہے بشرطیکہ وہ اپنی اصلی حالت میں ہو اور مکمل پیکنگ میں ہو۔ چائنہ آئیٹمز کی واپسی نہیں ہوگی۔ کسی بھی آئٹم کی واپسی صرف بل یا رسید کی موجودگی میں ہی قابل قبول ہوگی۔ </p>

                    </div>
                }

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
