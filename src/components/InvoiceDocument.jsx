import React from 'react';

// ฟังก์ชันคำนวณราคากลางเป็นคำเขียนภาษาไทย (Bahttext)
export function bahtText(num) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  num = parseFloat(num).toFixed(2);
  const [integerPart, decimalPart] = num.split('.');
  
  const numbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  
  const convert = (numStr) => {
    let text = '';
    const len = numStr.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(numStr[i], 10);
      const pos = len - i - 1;
      if (digit !== 0) {
        // หลักสิบและลงท้ายด้วย 1
        if (pos % 6 === 1 && digit === 1) {
          text += 'สิบ';
        }
        // หลักสิบและลงท้ายด้วย 2
        else if (pos % 6 === 1 && digit === 2) {
          text += 'ยี่สิบ';
        }
        // หลักหน่วยและลงท้ายด้วย 1 โดยที่ไม่ได้อยู่ตัวเดียว
        else if (pos % 6 === 0 && digit === 1 && i > 0) {
          text += 'เอ็ด';
        }
        else {
          text += numbers[digit] + units[pos % 6];
        }
      }
      if (pos > 0 && pos % 6 === 0 && text !== '') {
        // เพิ่มหลักล้านเมื่อขึ้นช่วงใหม่
        text += 'ล้าน';
      }
    }
    return text;
  };
  
  let result = '';
  if (parseInt(integerPart, 10) === 0) {
    result += 'ศูนย์บาท';
  } else {
    result += convert(integerPart) + 'บาท';
  }
  
  if (parseInt(decimalPart, 10) === 0 || decimalPart === '00') {
    result += 'ถ้วน';
  } else {
    result += convert(decimalPart) + 'สตางค์';
  }
  return result;
}

export default function InvoiceDocument({ 
  invoiceData = {}, 
  onClose 
}) {
  // ค่าเริ่มต้นสำหรับบริษัทออกใบเสร็จ (SpareX)
  const companyInfo = {
    name: "SpareX Company Limited (Head Office)",
    address: "56/52 Samed Daeng rd., Thap Ma, Muang Rayong, Rayong 2100",
    taxId: "0215568001519",
    tel: "085-194-9422",
    email: "nissara@sparexth.com",
    ...invoiceData.companyInfo
  };

  // ข้อมูลลูกค้าและดีเทลบิล
  const customerInfo = {
    invoiceNo: invoiceData.invoiceNo || "INV202606001",
    date: invoiceData.date || "09/06/2026",
    purchaseOrder: invoiceData.purchaseOrder || "-",
    reference: invoiceData.reference || "REF-AIVA",
    customerName: invoiceData.customerName || "บริษัท โกลบอลเทค จำกัด (สำนักงานใหญ่)",
    billToAddress: invoiceData.billToAddress || "123/45 ถนนสีลม แขวงสุริยวงศ์ เขตบางรัก กรุงเทพฯ 10500",
    customerTaxId: invoiceData.customerTaxId || "0105560000000",
    shipToAddress: invoiceData.shipToAddress || "123/45 ถนนสีลม แขวงสุริยวงศ์ เขตบางรัก กรุงเทพฯ 10500",
    ...invoiceData.customerInfo
  };

  // รายการสินค้า
  const items = invoiceData.items || [
    { no: 1, description: "AIVA Pro Subscription Package (6 Months Upgrade)", qty: 1, unitPrice: 28518, amount: 28518 }
  ];

  // คำนวณราคาสุทธิ
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  const vat = subtotal * 0.07;
  const totalAmount = subtotal + vat;

  // เงื่อนไขชำระเงินของ SpareX
  const paymentDetails = {
    paymentTerms: invoiceData.paymentTerms || "100% Cash",
    paymentMethod: invoiceData.paymentMethod || "Bank Transfer",
    accountName: invoiceData.accountName || "SpareX Company Limited",
    bankAccount: invoiceData.bankAccount || "205-1-13812-3",
    bankName: invoiceData.bankName || "KASIKORNBANK (ธนาคารกสิกรไทย)",
    swiftCode: invoiceData.swiftCode || "KASITHBK",
    ...invoiceData.paymentDetails
  };

  // ผู้ลงนาม
  const signatures = {
    receivedBy: invoiceData.receivedBy || "",
    receivedDate: invoiceData.receivedDate || "",
    issuedBy: invoiceData.issuedBy || "Nissara Chatham",
    issuedDate: invoiceData.issuedDate || customerInfo.date,
    ...invoiceData.signatures
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 no-print-bg flex flex-col items-center">
      {/* CSS Styles สำหรับจัดระเบียบพิมพ์ให้สวยบนขนาด A4 */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-shadow {
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
        }
      `}} />

      {/* Control Panel (ซ่อนเมื่อสั่งพิมพ์) */}
      <div className="no-print w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">ตัวอย่างก่อนพิมพ์ (Print Preview)</h2>
            <p className="text-xs text-slate-500">เอกสารใบเสร็จ/ใบกำกับภาษี ของ SpareX</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button 
              onClick={onClose} 
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          )}
          <button 
            onClick={handlePrint} 
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            พิมพ์เอกสาร / บันทึก PDF
          </button>
        </div>
      </div>

      {/* ใบเสร็จขนาดจริง A4 */}
      <div className="print-container print-shadow w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-10 md:p-12 shadow-xl text-slate-800 flex flex-col font-sans transition-all">
        {/* Header Section */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
              Invoice / Tax Invoice / Receipt
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ใบเสร็จรับเงิน / ใบกำกับภาษี / ใบวางบิล
            </p>
            <div className="text-[13px] text-slate-600 space-y-1 mt-4">
              <div className="font-extrabold text-slate-900">{companyInfo.name}</div>
              <div><span className="font-semibold text-slate-400">Address:</span> {companyInfo.address}</div>
              <div><span className="font-semibold text-slate-400">Tax ID:</span> <span className="font-mono">{companyInfo.taxId}</span></div>
              <div><span className="font-semibold text-slate-400">Tel:</span> {companyInfo.tel}</div>
              <div><span className="font-semibold text-slate-400">Email:</span> {companyInfo.email}</div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 text-right">
            {/* SpareX Logo */}
            <div className="flex items-center gap-2">
              <svg className="w-10 h-10 text-indigo-600" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 45C36.0457 45 45 36.0457 45 25C45 13.9543 36.0457 5 25 5C13.9543 5 5 13.9543 5 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                <path d="M12 25C12 17.8203 17.8203 12 25 12" stroke="#EF4444" strokeWidth="5" strokeLinecap="round"/>
                <circle cx="25" cy="25" r="4" fill="currentColor"/>
              </svg>
              <div className="text-2xl font-black text-slate-900 tracking-tight flex flex-col leading-none">
                SpareX
                <span className="text-[9px] font-bold text-indigo-600 tracking-widest uppercase mt-0.5">Industrial Partner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Metadata & Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-slate-700 mb-8 pb-8 border-b border-slate-100">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-y-2.5">
            <div className="font-semibold text-slate-400">Invoice No.</div>
            <div className="font-bold text-slate-900 font-mono">: {customerInfo.invoiceNo}</div>
            
            <div className="font-semibold text-slate-400">Date</div>
            <div className="font-bold text-slate-900">: {customerInfo.date}</div>
            
            <div className="font-semibold text-slate-400">Purchase Order#</div>
            <div className="font-bold text-slate-900 font-mono">: {customerInfo.purchaseOrder}</div>
            
            <div className="font-semibold text-slate-400">SpareX Reference#</div>
            <div className="font-bold text-slate-900 font-mono">: {customerInfo.reference}</div>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">Bill to Address</span>
              <div className="font-extrabold text-slate-950">{customerInfo.customerName}</div>
              <div className="text-slate-600 leading-relaxed mt-1">{customerInfo.billToAddress}</div>
            </div>
            <div className="pt-2">
              <span className="font-semibold text-slate-400">Customer Tax ID:</span>
              <span className="font-bold text-slate-900 font-mono ml-2">{customerInfo.customerTaxId}</span>
            </div>
            {customerInfo.shipToAddress && (
              <div className="pt-2">
                <span className="font-semibold text-slate-400 block mb-0.5">Ship to Address</span>
                <div className="text-slate-600 leading-relaxed">{customerInfo.shipToAddress}</div>
              </div>
            )}
          </div>
        </div>

        {/* Table of Items */}
        <div className="flex-1 mb-8 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 w-12 text-center">No.</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5 w-20 text-center">Qty</th>
                <th className="px-5 py-3.5 w-36 text-right">Unit Price (THB)</th>
                <th className="px-5 py-3.5 w-36 text-right">Amount (THB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30">
                  <td className="px-5 py-4 text-center font-mono text-slate-400">{item.no || idx + 1}</td>
                  <td className="px-5 py-4 font-bold text-slate-900">{item.description}</td>
                  <td className="px-5 py-4 text-center font-mono">{item.qty}</td>
                  <td className="px-5 py-4 text-right font-mono text-slate-600">{item.unitPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-5 py-4 text-right font-bold font-mono text-slate-900">{item.amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              
              {/* เติมแถวว่างเพื่อให้ตารางดูเต็มสัดส่วนสวยงาม */}
              {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, emptyIdx) => (
                <tr key={`empty-${emptyIdx}`} className="h-12 border-none">
                  <td colSpan="5"></td>
                </tr>
              ))}

              {/* In Words & Totals Block */}
              <tr className="bg-slate-50/50 font-semibold border-t border-slate-200">
                <td colSpan="2" className="px-5 py-4 text-slate-700 italic border-r border-slate-200">
                  <span className="text-xs text-slate-400 block not-italic font-bold">ตัวอักษร / In Words</span>
                  {bahtText(totalAmount)}
                </td>
                <td colSpan="2" className="px-5 py-2.5 text-right text-slate-500 font-semibold border-b border-slate-100">
                  Subtotal :
                </td>
                <td className="px-5 py-2.5 text-right font-mono font-bold text-slate-800 border-b border-slate-100">
                  {subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-slate-50/50 font-semibold">
                <td colSpan="2" className="border-r border-slate-200"></td>
                <td colSpan="2" className="px-5 py-2.5 text-right text-slate-500 font-semibold border-b border-slate-100">
                  VAT 7% :
                </td>
                <td className="px-5 py-2.5 text-right font-mono font-bold text-slate-800 border-b border-slate-100">
                  {vat.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-slate-100/70 font-black">
                <td colSpan="2" className="border-r border-slate-200"></td>
                <td colSpan="2" className="px-5 py-3.5 text-right text-slate-700">
                  Total Amount :
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-lg text-indigo-600">
                  {totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Payment Terms & Banking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] mb-12">
          {/* Payment Details */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 space-y-2 text-slate-700">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-200 pb-2 mb-2 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Details
            </h3>
            <div className="grid grid-cols-3 gap-y-1.5">
              <div className="font-semibold text-slate-400">Payment Terms</div>
              <div className="col-span-2 font-bold text-slate-900">: {paymentDetails.paymentTerms}</div>
              
              <div className="font-semibold text-slate-400">Payment Method</div>
              <div className="col-span-2 font-bold text-slate-900">: {paymentDetails.paymentMethod}</div>
              
              <div className="font-semibold text-slate-400">Account Name</div>
              <div className="col-span-2 font-bold text-slate-900">: {paymentDetails.accountName}</div>
              
              <div className="font-semibold text-slate-400">Bank Account</div>
              <div className="col-span-2 font-black text-indigo-600 font-mono">: {paymentDetails.bankAccount} ({paymentDetails.bankName})</div>
              
              <div className="font-semibold text-slate-400">Swift Code</div>
              <div className="col-span-2 font-bold text-slate-900 font-mono">: {paymentDetails.swiftCode}</div>
            </div>
          </div>

          {/* Signature Boxes */}
          <div className="grid grid-cols-2 gap-4 text-center">
            {/* Received Goods */}
            <div className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between h-36">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Received Goods By</div>
              <div className="border-b border-slate-300 w-3/4 mx-auto pb-1 text-slate-900 font-semibold">{signatures.receivedBy || '\u00A0'}</div>
              <div>
                <div className="text-xs font-bold text-slate-800">Date: {signatures.receivedDate || '___/___/______'}</div>
              </div>
            </div>

            {/* Issued By */}
            <div className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between h-36">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Invoice Issued By</div>
              <div className="border-b border-slate-300 w-3/4 mx-auto pb-1 text-slate-900 font-bold">{signatures.issuedBy}</div>
              <div>
                <div className="text-xs font-bold text-slate-800">Date: {signatures.issuedDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center border-t border-slate-100 pt-6 mt-auto text-slate-400 text-xs font-bold tracking-wider">
          SpareX | Your Industrial Partner
        </div>
      </div>
    </div>
  );
}
