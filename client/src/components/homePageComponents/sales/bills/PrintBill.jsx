/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ViewBill from './ViewBill';
import Button from '../../../Button';
import { useParams } from 'react-router-dom';
import config from '../../../../features/config';
import Loader from '../../../../pages/Loader';
import ViewBillThermal from './ViewBillThermal';

const PrintBill = () => {

  const [bill, setBill] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [exemptedParagraph, setExemptedParagraph] = useState(false)
  const [quotation, setquotation] = useState(false)

  const componentRef = useRef();
  const { billId } = useParams()

  useEffect(() => {
    async function fetchBill() {
      setIsLoading(true);
      try {
        const response = await config.fetchSingleBill(billId);
        console.log('bill', response)
        setBill(response.data);
      } catch (error) {
        console.error('Error fetching bill:', error);
      } finally {
        setIsLoading(false);
      }
    }
    if (billId) fetchBill();
  }, [billId]);

  // const pageStyle = `@page { size: auto; margin: 0.1in; } @media print { body { margin: 0.5in; } }`;
  // Function to handle printing the bill
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  const handleSaveAsPDF = (billType) => {
    const invoiceElement = componentRef.current;

    // Define dimensions for thermal and A4 bills
    const THERMAL_WIDTH = 80; // Thermal width in mm
    const THERMAL_HEIGHT = 200; // Approximate thermal height in mm
    const A4_WIDTH = 210; // A4 width in mm
    const A4_HEIGHT = 295; // A4 height in mm

    html2canvas(invoiceElement, {
      scale: (billId.at(0) === 'A') ? 1 : 1, // Higher scale for better quality
      useCORS: true, // Allow external images
      logging: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      let pdf;

      if (!(billId.at(0) === 'A')) {
        // Thermal Bill - No Pagination
        const imgWidth = THERMAL_WIDTH; // Thermal bill width
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf = new jsPDF("p", "mm", [THERMAL_WIDTH, imgHeight]); // Custom size for thermal
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // A4 Bill - Paginated
        const imgWidth = A4_WIDTH;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf = new jsPDF("p", "mm", "a4");

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= A4_HEIGHT;

        while (heightLeft > 0) {
          position -= A4_HEIGHT;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= A4_HEIGHT;
        }
      }

      // Save the generated PDF
      pdf.save(`${billId}.pdf`);
    });
  };




  // return isLoading ? (
  return !isLoading ? (

    <div>
      <div className='flex items-center gap-3'>
        <Button onClick={handlePrint} className='text-xs px-4 mb-2'>
          Print Bill
        </Button>
        <Button onClick={handleSaveAsPDF} className='text-xs px-4 mb-2'>
          Save in PDF
        </Button>
        <div className='text-xs mb-2 flex gap-2'>
          <label htmlFor="exempted" className=''>Add Exempted Paragraph</label>
          <input type='checkbox' id='exempted' className='' checked={exemptedParagraph==true} onChange={() => setExemptedParagraph((prev) => !prev)}/>
        </div>
        <div className='text-xs mb-2 flex gap-2'>
          <label htmlFor="quotation" className=''>Quotation</label>
          <input type='checkbox' id='quotation' className='' checked={quotation==true} onChange={() => setquotation((prev) => !prev)}/>
        </div>

      </div>

      {/* Render the bill content */}
      {billId.at(0) === 'A' ?
        <ViewBill bill={bill} ref={componentRef} exemptedParagraph={exemptedParagraph} quotation={quotation}/>
        :
        <ViewBillThermal bill={bill} ref={componentRef} exemptedParagraph={exemptedParagraph} quotation={quotation}/>
      }
    </div>
  ) :
    <Loader h_w="w-16 h-16 border-b-4 border-t-4" message='Loading bill...' />
};

export default PrintBill;
