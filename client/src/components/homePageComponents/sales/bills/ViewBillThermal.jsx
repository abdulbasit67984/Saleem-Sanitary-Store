/* eslint-disable react/prop-types */
import React from 'react';
import Logo from '../../../Logo';

// ViewBill component wrapped in forwardRef
const ViewBillThermal = React.forwardRef((props, ref) => {
    const bill = props.bill;
    const exemptedParagraph = bill.BusinessId?.exemptedParagraph?.split('۔')
    const quotation = props.quotation
    // console.log(exemptedParagraph)

    const truncateString = (str, maxLength) => {
        if (!str) return "";
        return str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str;
      };

    return bill && (
        <div className="thermal-bill w-[80mm] min-h-[24rem] max-h-72 shadow-lg overflow-y-auto scrollbar-thin mx-auto">
            <div ref={ref} className="view-bill p-2 bg-white">
                
                {/* Business Information */}
                <div className="text-center mb-2">

                    <h2 className="text-sm mt-2 font-bold">{bill.BusinessId.businessName}</h2>
                    <p className="text-[10px]">{bill.BusinessId.businessRegion}</p>
                    <p className="text-[10px]">{bill.BusinessId.owner?.mobileno}</p>
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
                    <p><span className='font-semibold pr-1'>Customer:</span> {bill.customer?.customerName}</p>
                </div>

                {/* Items Section */}
                <div className="my-4">
                    <table className="w-full text-[10px] border border-gray-600">
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className="p-1 text-left">Item</th>
                                <th className="p-1 text-left">Company</th>
                                <th className="p-1 text-right">Qty</th>
                                {!quotation && <th className="p-1 text-right">Price</th>}
                                {!quotation && <th className="p-1 text-right">Total</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bill.billItems && bill.billItems.map((item, index) => (
                                <tr key={index} className="border border-gray-600">
                                    <td className="p-1">{truncateString(item.productId.productName, 13)}</td>
                                    <td className="p-1">{truncateString(item.productId.companyId?.companyName, 13)}</td>
                                    <td className="p-1 text-right">{item.quantity}</td>
                                    {!quotation && <td className="p-1 text-right">{item.billItemPrice.toFixed(2)}</td>}
                                    {!quotation && <td className="p-1 text-right">
                                        {((item.quantity * item.billItemPrice) -
                                            ((item.quantity * item.billItemPrice) * item.billItemDiscount / 100)).toFixed(2)}
                                    </td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
               {!quotation &&  <div className='flex justify-end'>
                    <div className="text-xs mt-2 w-32 border p-2 border-gray-600">
                        <p><span className='font-semibold w-14 inline-block'>Total:</span> {bill.totalAmount?.toFixed(2)}</p>
                        <p className='font-bold'><span className='font-semibold w-14 inline-block'>Discount:</span> {bill.flatDiscount.toFixed(2)}</p>
                        <p><span className='font-semibold w-14 inline-block'>Paid:</span> {bill.paidAmount.toFixed(2)}</p>
                        <p><span className='font-semibold w-14 inline-block'>Balance:</span> {(bill.totalAmount - bill.flatDiscount - bill.paidAmount).toFixed(2)}</p>
                    </div>
                </div>}

                <div className='mt-3'>
                    <ul className='text-[8px] text-right'>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> کوئی بھی آئیٹم واپس یا تبدیل ہو سکتی ہے بشرطیکہ وہ اپنی اصلی حالت میں ہو اور مکمل پیکنگ میں ہو
                        </li>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> کسی بھی آئٹم کی واپسی صرف بل یا رسید کی موجودگی میں ہی قابل قبول ہوگی
                        </li>
                        <li className='flex flex-row-reverse gap-1 pt-1'>
                            <span>&#8592;</span> چائنہ آئیٹمز کی واپسی نہیں ہوگی
                        </li>
                    </ul>
                </div>

                {/* Footer Section */}
                {props.exemptedParagraph == true &&
                    <div className="text-justify mt-1 text-[8px] pb-5">
                        <h4 className='text-center text-[10px] py-2 font-bold'>:ضروری ہدایات</h4>
                        <ul>
                            {exemptedParagraph?.map((paragraph, i) => (
                                paragraph.length > 3 &&
                                <li key={i} className='text-right flex flex-row-reverse gap-1 pt-1'> <span>&#8592;</span> <span>{paragraph}</span></li>
                            ))}
                        </ul>
                    </div>
                }
                <div className='flex justify-center mt-3'>
                    <Logo width='w-10 h-10' className='rounded-full opacity-90 hue-rotate-180' />

                </div>
                <div className='text-center text-[8px]'>Software by Pandas. 📞 03103480229 🌐 www.pandas.com.pk</div>
            </div>
        </div>
    );
});

// Add displayName for better debugging
ViewBillThermal.displayName = 'ViewBillThermal';

export default ViewBillThermal;
