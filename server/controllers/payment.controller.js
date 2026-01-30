import Razorpay from "razorpay";
import { Doctor } from "../models/Doctor.js"; 
import { Patient } from "../models/Patient.js";
import crypto from "crypto"
import { Appointment } from "../models/Appointment.js";


export const createOrder = async (req, res) => {
  try {
    const { doctorId } = req.body; 

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const amount = doctor.consultationFee; 

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
 

    if (!order) {
      return res.status(400).json({ success: false, message: "Order not created" });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Error in Razorpay order creation:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



export const verifyPayment = async (req, res) => {
  try {
 

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentData } = req.body;
    
    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");



    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch");
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

  

    const patient = await Patient.findOne({ userId: req.user.id });

    const finalAppointmentData = {
      ...appointmentData,
      patientId: patient._id,
      bookedBy: req.user.id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: "paid",
      status: "booked",
    };

   

    // Create appointment
    const appointment = await Appointment.create(finalAppointmentData);
    

    res.status(200).json({
      success: true,
      message: "Payment verified & appointment confirmed ✅",
      appointment,
    });

  } catch (error) {
    console.error("❌ Error in payment verification:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.stack 
    });
  }
};