/* eslint-disable react/prop-types */
import React from 'react';
import Logo from '../../../Logo';

// ViewBill component wrapped in forwardRef
const ViewBillThermal = React.forwardRef((props, ref) => {
    const bill = props.bill;
    const exemptedParagraph = bill.BusinessId?.exemptedParagraph?.split('۔')
    const quotation = props.quotation
    // console.log(exemptedParagraph)

    return bill && (
        <div className="thermal-bill w-[80mm] min-h-[28rem] shadow-lg overflow-y-auto scrollbar-thin mx-auto">
            <div ref={ref} className="view-bill p-2 bg-white">
                
                {/* Business Information */}
                <div className="text-center mb-2">

                    <h2 className="text-sm mt-6 font-bold">{bill.BusinessId.businessName}</h2>
                    <p className="text-[10px]">{bill.BusinessId.businessRegion}</p>
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
                                <th className="p-1 text-left">company</th>
                                <th className="p-1 text-right">Type</th>
                                <th className="p-1 text-right">Qty</th>
                                {!quotation && <th className="p-1 text-right">Price</th>}
                                {!quotation && <th className="p-1 text-right">Total</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bill.billItems && bill.billItems.map((item, index) => (
                                <tr key={index} className="border border-gray-600">
                                    <td className="p-1">{item.productId.productName}</td>
                                    <td className="p-1">{item.productId.companyId?.companyName}</td>
                                    <td className="p-1 text-right">{item.productId.typeId?.typeName}</td>
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

                {/* Footer Section */}
                {props.exemptedParagraph == true &&
                    <div className="text-justify mt-4 text-[8px] pb-5">
                        <h4 className='text-center text-[10px] py-2 font-bold'>:ضروری ہدایات</h4>
                        <ul>
                            {exemptedParagraph?.map((paragraph, i) => (
                                paragraph.length > 3 &&
                                <li key={i} className='text-right flex flex-row-reverse gap-1'> <span>&#8592;</span> <span>{paragraph}</span></li>
                            ))}
                        </ul>
                    </div>
                }
                <div className='flex justify-center mt-3'>
                    <Logo width='w-10 h-10' className='rounded-full opacity-90 hue-rotate-180' />

                </div>
                <div className='text-center text-xs'>PANDAS</div>
            </div>
        </div>
    );
});

// Add displayName for better debugging
ViewBillThermal.displayName = 'ViewBillThermal';

export default ViewBillThermal;
