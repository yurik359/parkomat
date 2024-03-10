import "./payments.css";
import PaymentSlotItem from "../components/PaymentSlotItem/PaymentSlotItem";
import { useSelector } from "react-redux";
import { saveEndpointInfo } from "../services/requests";
import { useEffect, useState } from "react";
const Payments = () => {
  const { paymentsInfo } = useSelector((state) => state.slotsSlice);

  return (
    <div className="payment-page wrapper">
      <PaymentSlotItem
        paymentsInfo={paymentsInfo}
        title={"Fondy"}
        placeholder={"merchant id"}
      />
      <PaymentSlotItem
        paymentsInfo={paymentsInfo}
        title={"Stripe"}
        placeholder={"Publish api"}
      />
    </div>
  );
};

export default Payments;
