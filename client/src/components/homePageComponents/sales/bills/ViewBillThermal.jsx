/* eslint-disable react/prop-types */
import React from 'react';
import Logo from '../../../Logo';
import commonFunction from '../../../../features/functions';
import Barcode from 'react-barcode';
import thermalLogo from '../../../../assets/thermalBillLogo.jpg'
import paymentQR from '../../../../assets/paymentQR.jpg'


// ViewBill component wrapped in forwardRef
const ViewBillThermal = React.forwardRef((props, ref) => {
    const bill = props.bill;
    const exemptedParagraph = bill.BusinessId?.exemptedParagraph
    const packingSlip = props.packingSlip
    const previousBalance = props.previousBalance
    const showPreviousBalance = props.showPreviousBalance
    const showExemptedParagraph = props.exemptedParagraph
    // console.log(exemptedParagraph)



    return bill && (
        <div className="thermal-bill mt-5 w-[80mm] min-h-[24rem] max-h-72 shadow-lg overflow-y-auto scrollbar-thin mx-auto">
            <div ref={ref} className="view-bill p-2 bg-white text-black">

                {/* Business Information */}
                <div className="text-center mb-2">

                    <h2 className="text-sm mt-2 font-bold">{bill?.BusinessId?.businessName}</h2>
                    <p className="text-[10px]">{bill?.BusinessId?.businessRegion}</p>
                    <p className="text-[10px]">{bill?.BusinessId?.owner?.mobileno?.map((num, i) => <span className='px-1' key={i}>{num}</span>)}</p>
                    <h3 className="text-[10px] font-semibold mt-2">Sale Receipt</h3>
                </div>

                {/* Invoice and Customer Information */}
                <div className="mb-2 text-[10px]">
                    <p><span className='font-semibold pr-1'>Receipt No:</span> {bill.billNo}</p>
                    <p><span className='font-semibold pr-1'>Date:</span>{
                        bill.createdAt &&
                        new Date(bill.createdAt).toLocaleString("en-PK", {
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
                    <p><span className='font-semibold pr-1'>Customer:</span> {bill.customer?.customerName || 'Walk-in'}</p>
                </div>

                {/* Items Section */}
                <div className="my-4">
                    <table className="w-full text-[10px] border border-gray-600">
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className="p-1 text-left">Item</th>
                                <th className="p-1 text-center">Qty</th>
                                {!packingSlip && <th className="p-1 text-right">Price</th>}
                                {!packingSlip && <th className="p-1 text-right">Total</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bill.billItems && bill.billItems.map((item, index) => (
                                <tr key={index} className="border border-gray-600">
                                    <td className="p-1">{commonFunction.truncateString(item.productId?.productName, 21)}</td>
                                    <td className="p-1 text-center pl-8">
                                        <div>
                                            {((item.quantity + item.billItemUnit / item.billItemPack) < 1 || item.quantity === 0) ? (item.billItemUnit) : (item.quantity + item.billItemUnit / item.billItemPack)?.toFixed(2) }
                                            <span> {((item.quantity + item.billItemUnit / item.billItemPack) < 1 || item.quantity === 0) ? (item.productId?.packUnit)?.toUpperCase() || 'PCS' : (item.productId?.quantityUnit)?.toUpperCase() || 'PCS' }</span>
                                        </div>
                                    </td>
                                    {!packingSlip && 
                                    <td className="p-1 text-right">
                                        {((item.quantity + item.billItemUnit / item.billItemPack) < 1 || item.quantity === 0) ? commonFunction.formatAsianNumber(item.billItemPrice / item.billItemPack) : commonFunction.formatAsianNumber(item.billItemPrice)}
                                    </td>
                                    }
                                    {!packingSlip && <td className="p-1 text-right">
                                        {commonFunction.formatAsianNumber(((item.quantity + item.billItemUnit / item.billItemPack) * item.billItemPrice) -
                                            (((item.quantity + item.billItemUnit / item.billItemPack) * item.billItemPrice) * item.billItemDiscount / 100))}
                                    </td>}
                                </tr>
                            ))}

                            {bill.extraItems && bill.extraItems.map((item, index) => (
                                <tr key={index} className="border border-gray-600">
                                    <td className="p-1">{commonFunction.truncateString(item.itemName, 21)}</td>
                                    <td className="p-1 text-right">{item.quantity} PCS</td>
                                    {!packingSlip && <td className="p-1 text-right">{commonFunction.formatAsianNumber(item.salePrice)}</td>}
                                    {!packingSlip && <td className="p-1 text-right">
                                        {commonFunction.formatAsianNumber((item.quantity * item.salePrice))}
                                    </td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                {!packingSlip && <div className='flex justify-end'>
                    <div className={` text-xs mt-2 ${showPreviousBalance ? 'w-7/12' : 'w-36'} border flex flex-col gap-[2px] p-2 border-gray-600`}>
                        <p><span className={`font-semibold ${showPreviousBalance ? 'w-20' : 'w-16'} inline-block`}>Total:</span> {commonFunction.formatAsianNumber(bill.totalAmount)}</p>
                        <p className='font-bold'><span className={`font-semibold ${showPreviousBalance ? 'w-20' : 'w-16'} inline-block`}>Discount:</span> {commonFunction.formatAsianNumber(bill.flatDiscount)}</p>
                        <p><span className={`font-semibold ${showPreviousBalance ? 'w-20' : 'w-16'} inline-block`}>Paid:</span> {commonFunction.formatAsianNumber(bill.paidAmount)}</p>
                        <p><span className={`font-semibold ${showPreviousBalance ? 'w-20' : 'w-16'} inline-block`}>Balance:</span> {commonFunction.formatAsianNumber(bill.totalAmount - bill.flatDiscount - bill.paidAmount)}</p>
                        {showPreviousBalance &&
                            <p className='font-semibold'>
                                <span className={` ${showPreviousBalance ? 'w-20' : 'w-16'} inline-block`}>Previous Bal. :</span>
                                <span className='underline'>{previousBalance && commonFunction.formatAsianNumber((previousBalance) - (bill.totalAmount - bill.flatDiscount - bill.paidAmount))}</span>
                            </p>
                        }
                        {showPreviousBalance &&
                            <p>
                                <span className={`font-semibold ${showPreviousBalance ? 'w-20' : 'w-16'} inline-block`}> Total:</span> {previousBalance && commonFunction.formatAsianNumber(previousBalance)}
                            </p>
                        }
                    </div>
                </div>}

                {/* <div className='mt-3'>
                    <ul className='text-[8px] text-right'>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> کوئی بھی آئیٹم واپس یا تبدیل ہو سکتا ہے بشرطیکہ وہ اپنی اصلی حالت میں ہو اور مکمل پیکنگ میں ہو
                        </li>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> کسی بھی آئٹم کی واپسی صرف بل یا رسید کی موجودگی میں ہی قابل قبول ہوگی
                        </li>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> چائنہ آئیٹمز کی واپسی نہیں ہوگی
                        </li>
                    </ul>
                </div> */}

                {/* Footer Section */}
                {showExemptedParagraph &&
                    <div className="text-center mt-3 text-xs font-semibold ">
                        {exemptedParagraph}
                    </div>
                }
                <p className=' text-center text-xs mt-3'>Thank You For Shopping!</p>
                <div className=''>
                    <ul className='text-[9px] text-right'>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> کوئی بھی آئیٹم واپس یا تبدیل ہو سکتا ہے بشرطیکہ وہ اپنی اصلی حالت میں ہو اور مکمل پیکنگ میں ہو
                        </li>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> کسی بھی آئٹم کی واپسی صرف بل یا رسید کی موجودگی میں ہی قابل قبول ہوگی
                        </li>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> چائنہ آئیٹمز کی واپسی نہیں ہوگی
                        </li>
                        
                    </ul>
                </div>
                <div className="flex justify-center my-3">
                    <img src={paymentQR} alt="" className=' h-32' />
                </div>


                <div className='flex justify-center mt-2'>
                    <img src={thermalLogo} className='h-10' alt="Pandas" />

                </div>
                <div className='text-center text-[8px]'>Software by Pandas. 📞 03103480229 🌐 www.pandas.com.pk</div>
            </div>
        </div>
    );
});

// Add displayName for better debugging
ViewBillThermal.displayName = 'ViewBillThermal';

export default ViewBillThermal;
