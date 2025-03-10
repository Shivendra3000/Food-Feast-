import { query } from "express";
import orderModel from "../Models/orderModel.js";
import userModel from "../Models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config(); // Ensure env variables are loaded

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        if (!req.body.userId || !req.body.items || !req.body.amount || !req.body.address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 // Convert to paise
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 20*100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            customer_email: req.body.email || undefined
        });
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (!orderId) {
            return res.status(400).json({ success: false, message: "Invalid order ID" });
        }
        
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
       console.error("Order Verification Error:", error);
       res.status(500).json({ success: false, message: error.message });
   
    }
}

const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})  
    }
}

 const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateStatus = async (req,res) => {
     try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
     }
}

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
