// Simulated Easypaisa payment
export const initiateEasypaisaPayment = async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    
    // Simulate payment processing
    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }
    
    // Generate mock transaction ID
    const transactionId = `EP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Simulate 95% success rate for demo
    const isSuccess = Math.random() < 0.95;
    
    if (isSuccess) {
      res.json({
        success: true,
        transactionId,
        message: 'Payment successful'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};