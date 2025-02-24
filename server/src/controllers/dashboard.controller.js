import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Bill } from "../models/bills/bill.model.js";
import { Product } from "../models/product/product.model.js";
import { Category } from "../models/product/category.model.js"
import { IndividualAccount } from "../models/accounts/individualAccount.model.js";

const getDashboardData = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized request.");
    }

    const { BusinessId } = user;

    if (!BusinessId) {
      throw new ApiError(400, "BusinessId is missing in the request.");
    }

    // Fetch Sales Data for Line Chart (from Bill schema)
    const salesData = await Bill.aggregate([
      { $match: { BusinessId: new mongoose.Types.ObjectId(BusinessId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id",
          sales: "$totalSales",
        },
      },
    ]);

    // Fetch Stock Data for Pie Chart (from Product schema)
    const stockData = await Product.aggregate([
        { $match: { BusinessId: new mongoose.Types.ObjectId(BusinessId) } },
        {
          $group: {
            _id: "$productName",
            totalStock: { $sum: { $divide: ["$productTotalQuantity", "$productPack"] } },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: "$totalStock",
          },
        },
      ]);

    // Fetch Category Data for Bar Chart (from Category schema)
    const categoryData = await Category.aggregate([
      { $match: { BusinessId: new mongoose.Types.ObjectId(BusinessId) } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        },
      },
      {
        $project: {
          _id: 0,
          category: "$categoryName",
          quantity: { $size: "$products" },
        },
      },
    ]);

    const revenueAccount = await IndividualAccount.findOne({
        BusinessId: new mongoose.Types.ObjectId(BusinessId),
        individualAccountName: "Sales Revenue",
      });

      if (!revenueAccount) {
        throw new ApiError(404, "Sales Revenue account not found.");
      }
   

    // Calculate KPIs
    const totalSales = salesData.reduce((acc, item) => acc + item.sales, 0);
    const totalRevenue = revenueAccount.accountBalance; 
    const avgSales = (totalSales / salesData.length).toFixed(2);
    const topProduct = stockData.reduce((prev, curr) =>
      curr.value > prev.value ? curr : prev
    ).name;

    // Return Dashboard Data
    return res.status(200).json(
      new ApiResponse(200, {
        salesData,
        stockData,
        categoryData,
        totalSales,
        totalRevenue,
        avgSales,
        topProduct,
      }, "Dashboard data fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new ApiError(500, "Failed to retrieve dashboard data.");
  }
});

export { getDashboardData };