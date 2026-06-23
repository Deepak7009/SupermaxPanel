import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";

import Product from "@/app/admin/models/Product";
import Category from "@/app/admin/models/Category";
import Order from "@/app/admin/models/Order";
import Customer from "@/app/admin/models/Customer";

const getDashboard = async () => {
  try {
    await connectToDatabase();

    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      recentOrders,
      lowStockProducts,
      latestCategories,
    ] = await Promise.all([
      Product.countDocuments(),

      Category.countDocuments(),

      Order.countDocuments(),

      Customer.countDocuments(),

      Order.find().sort({ createdAt: -1 }).limit(5),

      Product.find({
        stock: { $lte: 10 },
      })
        .select("name stock")
        .limit(5),

      Category.find().sort({ createdAt: -1 }).limit(5).select("name"),
    ]);

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalCustomers,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
      },

      recentOrders,

      lowStockProducts,

      latestCategories,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard",
      },
      {
        status: 500,
      },
    );
  }
};

export { getDashboard as GET };
