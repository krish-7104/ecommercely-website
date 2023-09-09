import { setCartData } from "@/redux/actions";
import { InitialState } from "@/redux/types";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const StripePaymentForm = ({
  orderData,
  customerName,
}: {
  orderData: any;
  customerName: string;
}) => {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const router = useRouter();
  const cartData = useSelector((state: InitialState) => state.cart);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    toast.loading("Processing Payment..");
    if (!stripe || !elements) {
      console.error("Stripe or Elements not initialized.");
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.dismiss();
      console.error("Card Element not found.");
      setIsLoading(false);
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: customerName,
      },
    });

    if (error) {
      console.error("Stripe error:", error);
      toast.dismiss();
      setIsLoading(false);
    } else {
      try {
        const response = await axios.post("/api/payments/create-payment", {
          paymentMethodId: paymentMethod?.id,
          amount: orderData.total * 100,
        });
        setIsLoading(false);
        const { data } = await axios.post("/api/order/addorder", {
          ...orderData,
        });
        const sendData = {
          id: cartData.id,
          products: [],
        };
        await axios.post(`/api/cart/update/${cartData.id}`, sendData);
        dispatch(setCartData({ products: [], id: "" }));
        toast.dismiss();
        toast.success("Order Placed!");
        router.push(`/order/${data.id}`);
      } catch (error) {
        console.error("Server error:", error);
        toast.dismiss();
        setIsLoading(false);
        setPaymentError("An error occurred while processing the payment.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
              },
            },
          }}
        />
      </div>
      {paymentError && <div className="text-red-500 mb-4">{paymentError}</div>}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : "Pay And Place Order"}
      </button>
    </form>
  );
};

export default StripePaymentForm;
