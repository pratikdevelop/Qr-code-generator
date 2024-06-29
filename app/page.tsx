'use client';
import Image from 'next/image';
import download from '@/public/download.png'
 import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

import QRCode from 'qrcode'
export default function Home() {
  const [upiString, setUpiString] = useState('');
  const [formData, setFormData] = useState({
    upiHandle: '',
    amount: '',
  });
  const qrContainerRef = useRef<any>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const { upiHandle, amount } = formData;
    if (validateForm()) {
      const upi = `upi://pay?pa=${upiHandle}&am=${amount}`;
      setUpiString(upi);
    } else {
      setUpiString('');
    }
  }, [formData]);

  // form Validation logic for checking if the data entered is valid or not
  const validateForm = () => {
    const { upiHandle, amount } = formData;
    const upiHandleRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    const amountValue = parseFloat(amount);
    return (
      upiHandleRegex.test(upiHandle) && amountValue > 0 && amountValue <= 100000
    );
  };
  const handleDownload = () => {
    html2canvas(qrContainerRef.current).then((canvas: { toDataURL: (arg0: string) => string; }) => {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };
  return (
    <main className="container min-h-[80vh] mx-auto rounded-2xl shadow-lg grid bg-[#fcf7e3] grid-cols-1 md:grid-cols-2 items-center justify-center p-4 md:px-24 md:pb-24 md:pt-0">
      <h1 className="md:col-span-2 text-center text-3xl">UPI Quick Code</h1>
      <div className="flex flex-col items-center w-full justify-center">
        <form className="space-y-4 w-full px-4">
          <h2>Enter Your UPI Id</h2>
          <input
            type="text"
            name="upiHandle"
            onChange={handleChange}
            placeholder="example@upi"
            value={formData.upiHandle}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <h3>Enter Amount</h3>
          <input
            type="number"
            name="amount"
            onChange={handleChange}
            placeholder="25000"
            value={formData.amount}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </form>
        <button
          onClick={handleDownload}
          className="bg-[#ff7978] text-white px-4 py-2 rounded-xl shadow-xl mt-10 mb-10 md:mb-0"
        >
          Download QR
        </button>
      </div>

      <div
        ref={qrContainerRef}
        className="bg-[#ebe6d3] w-full h-full flex flex-col justify-around p-4 items-center rounded-2xl shadow-xl"
      >
        <p className="text-xl">
          {formData.upiHandle ? formData.upiHandle : 'Enter UPI Handle'}
        </p>
        <QRCodeDisplay upiString={upiString} />
        <div>
          <h2 className="text-xl text-center mb-4">
            Scan & Pay with any UPI app
          </h2>
          <Image
            src={download}
            alt="Scan and pay with any upi app - amazon pay - google pay - phonepe - paytm"
          />
        </div>
      </div>
    </main>
  );
}

const QRCodeDisplay = (upiString: { upiString: string; } ) => {
  const qrRef = useRef(null);

  useEffect(() => {
    if (upiString) {
      const canvas = qrRef.current;
      const text = upiString.upiString;
      QRCode.toCanvas(canvas, text);
    }
  }, [upiString]);

  return (
    <div className="border border-black p-3 rounded-xl bg-white">
      {upiString ? (
        <canvas ref={qrRef} />
      ) : (
        <Image width={250} height={250} src={download} alt="Dummy QR Code" />
      )}
    </div>
  );
};
