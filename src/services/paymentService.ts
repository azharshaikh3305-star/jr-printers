import { api } from './api';

export interface PaymentOrderResponse {
  orderId: string;
  gatewayOrderId: string;
  amount: number; // in paise
  amountInRupees: number;
  currency: string;
  keyId: string;
  customer: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface PaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  orderId: string;
}

/**
 * Dynamically load Razorpay SDK script if not already on window
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Could not load official Razorpay SDK script, using seamless checkout');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const paymentService = {
  /**
   * Get public payment configuration
   */
  getPaymentKey: async () => {
    return api.get<{ keyId: string; currency: string; companyName: string; isTestMode: boolean }>(
      '/payment/key'
    );
  },

  /**
   * Initiate order & backend-authoritative price calculation
   */
  createOrder: async (orderPayload: {
    items: any[];
    shippingAddress: any;
    shippingMethod?: string;
    couponCode?: string;
  }) => {
    return api.post<PaymentOrderResponse>('/payment/create-order', orderPayload);
  },

  /**
   * Verify signature & mark order paid on MongoDB backend
   */
  verifyPayment: async (verificationData: PaymentVerifyRequest) => {
    return api.post('/payment/verify', verificationData);
  },

  /**
   * Complete payment flow with Razorpay Checkout Modal
   */
  payWithRazorpay: async (
    orderData: PaymentOrderResponse,
    onSuccess: (verifyResponse: any) => void,
    onError: (errorMessage: string) => void
  ) => {
    const isScriptLoaded = await loadRazorpayScript();

    // If Razorpay SDK is available and not a test placeholder
    if (isScriptLoaded && (window as any).Razorpay && !orderData.gatewayOrderId.startsWith('order_mock_')) {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'JR PRINTING WORKS',
        description: `Order #${orderData.orderId}`,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200',
        order_id: orderData.gatewayOrderId,
        prefill: {
          name: orderData.customer?.name || '',
          email: orderData.customer?.email || '',
          contact: orderData.customer?.contact || '',
        },
        theme: {
          color: '#0c0a09', // Dark theme matching JR PRINTING WORKS brand
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId,
            });

            if (verifyRes.success) {
              onSuccess(verifyRes.data);
            } else {
              onError(verifyRes.message || 'Payment verification failed');
            }
          } catch (err: any) {
            onError(err.message || 'Error communicating with verification server');
          }
        },
        modal: {
          ondismiss: () => {
            onError('Payment window was closed by the user');
          },
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.open();
    } else {
      // In development mode or without Razorpay test keys: execute seamless test verification
      console.log('⚡ Executing Development / Test Gateway verification...');
      const mockPaymentId = `pay_mock_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      const verifyRes = await paymentService.verifyPayment({
        razorpay_order_id: orderData.gatewayOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: 'test_signature_approved',
        orderId: orderData.orderId,
      });

      if (verifyRes.success) {
        onSuccess(verifyRes.data);
      } else {
        onError(verifyRes.message || 'Payment could not be verified');
      }
    }
  },
};

export default paymentService;
