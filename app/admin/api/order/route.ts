"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { FilterQuery } from "mongoose";
import Order, { IOrder } from "../../models/Order";
import Customer from "../../models/Customer";
import Product from "../../models/Product";

// ---------------- CREATE ORDER ----------------
const createOrder = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.customerName || !data.totalAmount || !Array.isArray(data.items)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    // ---------------- FIND/CREATE CUSTOMER ----------------
    let customer = await Customer.findOne({
      $or: [{ email: data.customerEmail }, { phone: data.customerMobile }],
    });

    if (!customer) {
      customer = await Customer.create({
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerMobile,
        orders: [],
      });
    }

    // -------------------------------------------------------
    // ⭐ DEDUCT PRODUCT STOCK SAFELY (Universal structure)
    // -------------------------------------------------------
    for (const item of data.items) {
      const productId =
        item.productId || item.product?._id || item.product || null;

      const qty = item.quantity || item.qty || 0;

      if (!productId) {
        return NextResponse.json(
          { success: false, message: "Product ID missing in order item" },
          { status: 400 }
        );
      }

      const product = await Product.findById(productId);

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found` },
          { status: 404 }
        );
      }

      if (product.stock < qty) {
        return NextResponse.json(
          { success: false, message: `${product.name} has insufficient stock` },
          { status: 400 }
        );
      }

      product.stock -= qty;
      await product.save();
    }

    // -------------------------------------------------------
    // CREATE ORDER
    const newOrder = await Order.create(data);

    // PUSH ORDER TO CUSTOMER HISTORY
    customer.orders.push(newOrder._id);
    await customer.save();

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};

// ---------------- GET ALL / SINGLE ORDER ----------------
const getOrders = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = req.nextUrl;
    const id = url.searchParams.get("id");
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");

    // Get single order
    if (id) {
      const order = await Order.findById(id).populate("items.product");
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    // Get all orders
    const query: FilterQuery<IOrder> = {};
    if (status) query.status = status;

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ customerName: regex }, { customerEmail: regex }];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, orders, total, page, limit });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
};

export { createOrder as POST, getOrders as GET };
