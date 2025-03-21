import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";
import { AccountSubCategory } from "../models/accounts/accountSubCategory.model.js";
import { IndividualAccount } from "../models/accounts/individualAccount.model.js";
import { Bill } from "../models/bills/bill.model.js";
import { Business } from "../models/business.model.js";
import { AccountReceivable } from "../models/accounts/accountsReceivables.model.js";
import { Product } from "../models/product/product.model.js";
import { GeneralLedger } from "../models/accounts/generalLedger.model.js";
import { TransactionManager, AppTransaction } from "../utils/TransactionManager.js";


const registerBill = asyncHandler(async (req, res) => {
    const transactionManager = new TransactionManager();

    try {
        await transactionManager.run(async (transaction) => {
            const {
                customer,
                description,
                billType,
                billPaymentType,
                billItems,
                flatDiscount,
                billStatus,
                totalAmount,
                paidAmount,
                dueDate,
            } = req.body;

            if (customer && !mongoose.Types.ObjectId.isValid(customer)) {
                throw new ApiError(400, "Invalid customer ID format!");
            }

            const user = req.user;
            if (!user) {
                throw new ApiError(401, "Authorization Failed!");
            }

            const BusinessId = user.BusinessId;

            if (!billType || !billItems || !billItems.length || !totalAmount) {
                throw new ApiError(400, "Required fields are missing!");
            }

            const business = await Business.findById(BusinessId).select("businessName");
            if (!business || !business.businessName) {
                throw new ApiError(404, "Business not found or business name is missing!");
            }

            const businessName = business.businessName;
            const businessInitials = businessName
                .split(" ")
                .map((word) => word[0].toUpperCase())
                .join("");

            const lastBill = await Bill.findOne({ BusinessId, billType })
                .sort({ createdAt: -1 })
                .select("billNo");

            let nextSequence = 1;
            if (lastBill && lastBill.billNo) {
                const lastSequence = parseInt(lastBill.billNo.match(/\d+$/)?.[0]);
                if (lastSequence) {
                    nextSequence = lastSequence + 1;
                }
            }

            let billNo = "";
            if (billType === "A4") {
                billNo = `A4${businessInitials}${nextSequence.toString().padStart(5, "0")}`;
            } else if (billType === "thermal") {
                billNo = `TH${businessInitials}${nextSequence.toString().padStart(7, "0")}`;
            } else {
                throw new ApiError(400, "Invalid bill type!");
            }

            let totalPurchaseAmount = 0;
            let productName = "";

            for (const item of billItems) {
                const { productId, quantity, billItemUnit } = item;

                console.log('item', item)

                const purchaseCost = await Product.allocatePurchasePrice(productId, quantity, billItemUnit, transaction);
                if (typeof purchaseCost !== "number" || isNaN(purchaseCost)) {
                    console.log('purchaseCost', purchaseCost)
                    console.log(typeof (purchaseCost))
                    throw new Error(`Invalid purchase cost calculated for product ID ${productId}`);
                }
                totalPurchaseAmount += purchaseCost;

                const product = await Product.findById(productId);
                if (!product) {
                    throw new ApiError(404, `Product not found for ID: ${productId}`);
                }

                productName = product.productName;

                const originalProductQuantity = product.productTotalQuantity; // Capture original value for rollback
                product.productTotalQuantity -= (quantity * billItemUnit);

                if (product.productTotalQuantity < 0) {
                    throw new ApiError(400, `Insufficient stock for product: ${product.productName}`);
                }

                transaction.addOperation(
                    async () => await product.save(),
                    async () => {
                        product.productTotalQuantity = originalProductQuantity;
                        await product.save();
                    }
                );
            }

            if (flatDiscount > totalPurchaseAmount) {
                throw new ApiError(400, "Flat discount cannot exceed total purchase amount!");
            }

            const inventoryAccount = await IndividualAccount.findOne({
                BusinessId,
                individualAccountName: "Inventory",
            });

            const cashAccount = await IndividualAccount.findOne({
                BusinessId,
                individualAccountName: "Cash",
            });

            const salesRevenueAccount = await IndividualAccount.findOne({
                BusinessId,
                individualAccountName: "Sales Revenue",
            });

            const accountsReceivableAccount = await IndividualAccount.findOne({
                BusinessId,
                individualAccountName: "Account Receivables",
            });

            const customerIndividualAccount = await IndividualAccount.findOne({
                BusinessId,
                customerId: customer,
            });

            const totalBillItemDiscount = billItems.reduce((sum, item) => sum + (item.billItemDiscount || 0), 0);

            const outstandingAmount = totalAmount - paidAmount - flatDiscount - totalBillItemDiscount;

            if (outstandingAmount > 0 && !customer) {
                throw new ApiError(400, "Customer is required for Receivables!");
            }

            if (accountsReceivableAccount && outstandingAmount > 0) {
                const originalReceivableBalance = accountsReceivableAccount.accountBalance;
                accountsReceivableAccount.accountBalance += outstandingAmount;

                transaction.addOperation(
                    async () => await accountsReceivableAccount.save(),
                    async () => {
                        accountsReceivableAccount.accountBalance = originalReceivableBalance;
                        await accountsReceivableAccount.save();
                    }
                );
            } else if (!accountsReceivableAccount && outstandingAmount > 0) {
                throw new ApiError(400, "Accounts Receivable account not found!");
            }

            const originalInventoryBalance = inventoryAccount.accountBalance;
            inventoryAccount.accountBalance -= totalPurchaseAmount;

            const salesRevenue = totalAmount - flatDiscount - totalPurchaseAmount;
            const originalSalesRevenueBalance = salesRevenueAccount.accountBalance;
            salesRevenueAccount.accountBalance += salesRevenue;

            const originalCashBalance = cashAccount.accountBalance;
            cashAccount.accountBalance += paidAmount;

            const originalCustomerBalance = customerIndividualAccount.accountBalance;
            customerIndividualAccount.accountBalance += outstandingAmount;

            if (customerIndividualAccount.mergedInto !== null) {
                const mergedAccount = await IndividualAccount.findById(
                    customerIndividualAccount.mergedInto
                );
                mergedAccount.accountBalance += outstandingAmount;
                await mergedAccount.save();
            }

            transaction.addOperation(
                async () => {
                    await inventoryAccount.save();
                    await salesRevenueAccount.save();
                    await cashAccount.save();
                    await customerIndividualAccount.save();
                },
                async () => {
                    inventoryAccount.accountBalance = originalInventoryBalance;
                    salesRevenueAccount.accountBalance = originalSalesRevenueBalance;
                    cashAccount.accountBalance = originalCashBalance;
                    customerIndividualAccount.accountBalance = originalCustomerBalance;
                    await inventoryAccount.save();
                    await salesRevenueAccount.save();
                    await cashAccount.save();
                    await customerIndividualAccount.save();
                }
            );

            const bill = await Bill.create([
                {
                    BusinessId,
                    customer,
                    salesPerson: user._id,
                    billNo,
                    description,
                    billType,
                    billPaymentType,
                    billItems,
                    flatDiscount,
                    billStatus,
                    totalAmount,
                    paidAmount,
                    dueDate,
                    totalPurchaseAmount

                },
            ]);

            if (outstandingAmount > 0 && customer) {
                const accountReceivable = await AccountReceivable.create([
                    {
                        BusinessId,
                        customer,
                        details: bill[0]._id,
                        status: "active",
                    },
                ]);

                if (!accountReceivable) {
                    throw new ApiError(500, "Failed to create AccountReceivable!");
                }
            }

            if (customer) {
                await GeneralLedger.create(
                    [
                        {
                            BusinessId,
                            individualAccountId: customerIndividualAccount.mergedInto !== null ? customerIndividualAccount.mergedInto : customerIndividualAccount._id,
                            details: billItems.length === 1 ? ` ${productName}` : `Bill ${billNo}`,
                            debit: totalAmount - flatDiscount,
                            reference: customerIndividualAccount.mergedInto !== null ? customerIndividualAccount.mergedInto : customerIndividualAccount._id,
                        },
                        paidAmount
                            ? {
                                BusinessId,
                                individualAccountId: cashAccount._id,
                                details: `Cash received`,
                                credit: paidAmount,
                                reference: customerIndividualAccount.mergedInto !== null ? customerIndividualAccount.mergedInto : customerIndividualAccount._id,
                            }
                            : null,
                        {
                            BusinessId,
                            individualAccountId: salesRevenueAccount._id,
                            details: `Revenue for Bill ${billNo}`,
                            credit: salesRevenue,
                            reference: customerIndividualAccount.mergedInto !== null ? customerIndividualAccount.mergedInto : customerIndividualAccount._id,
                        },
                    ].filter(Boolean)
                );
            }

            // const test = true;
            // if(test){
            //     //test api error for transaction
            //     throw new ApiError(405, "Test error for transaction");
            // }
            res.status(201).json(new ApiResponse(201, { bill }, "Bill created successfully!"));
        });

    } catch (error) {
        throw new ApiError(500, `Transaction failed: ${error.message}`);
    }
});



const updateBill = asyncHandler(async (req, res) => {
    const { _id, description, billStatus, paidAmount, flatDiscount, dueDate, billItems, customer } = req.body;
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Authorization Failed!");
    }

    const BusinessId = user.BusinessId;
    const transactionManager = new TransactionManager();

    try {
        await transactionManager.run(async (transaction) => {
            // Find the existing bill
            const oldBill = await Bill.findOne({ _id, BusinessId }).populate("billItems.productId");
            if (!oldBill) {
                throw new ApiError(404, "Bill not found!");
            }

            // Preserve original bill data
            const oldBillData = JSON.parse(JSON.stringify(oldBill));

            // Calculate total amounts
            const calculateTotalAmount = (items) => {
                return items.reduce((total, item) => total + item.billItemPrice * item.quantity, 0);
            };

            const calculateTotalPurchaseAmount = (items) => {
                return items.reduce((total, item) => total + (item.productId.productPurchasePrice * item.quantity), 0);
            };

            const oldTotalAmount = calculateTotalAmount(oldBillData.billItems);
            const oldTotalPurchaseAmount = calculateTotalPurchaseAmount(oldBillData.billItems);

            const newBill = {
                ...oldBill.toObject(),
                description: description !== undefined ? description : oldBill.description,
                billStatus: billStatus !== undefined ? billStatus : oldBill.billStatus,
                paidAmount: paidAmount !== undefined ? paidAmount : oldBill.paidAmount,
                flatDiscount: flatDiscount !== undefined ? flatDiscount : oldBill.flatDiscount,
                dueDate: dueDate !== undefined ? dueDate : oldBill.dueDate,
                billItems: Array.isArray(billItems) ? billItems : oldBill.billItems,
                customer: customer !== undefined ? customer : (oldBill.customer !== undefined ? oldBill.customer : null)
            };

            const newTotalAmount = calculateTotalAmount(newBill.billItems);
            const newTotalPurchaseAmount = calculateTotalPurchaseAmount(newBill.billItems);

            newBill.totalAmount = newTotalAmount;
            newBill.totalPurchaseAmount = newTotalPurchaseAmount;
            console.log(oldTotalPurchaseAmount, newTotalPurchaseAmount);

            const amountDifference = newTotalPurchaseAmount - oldTotalPurchaseAmount;

            // Inventory Update
            const processInventoryChanges = async (oldItems, newItems) => {
                const oldItemsMap = new Map(oldItems.map((item) => [item.productId._id.toString(), item]));
                const newItemsMap = new Map(newItems.map((item) => [item.productId._id.toString(), item]));
                // console.log("1")

                for (const [productId, newItem] of newItemsMap) {
                    const oldItem = oldItemsMap.get(productId);
                    const oldQuantity = oldItem ? oldItem.quantity : 0;
                    const newQuantity = newItem.quantity;
                    const quantityDifference = newQuantity - oldQuantity;

                    if (quantityDifference !== 0) {
                        const product = await Product.findById(productId);
                        if (!product) {
                            throw new ApiError(404, `Product not found for ID: ${productId}`);
                        }

                        const originalProductQuantity = product.productTotalQuantity;
                        product.productTotalQuantity -= quantityDifference;

                        if (product.productTotalQuantity < 0) {
                            throw new ApiError(400, `Insufficient stock for product: ${product.productName}`);
                        }

                        transaction.addOperation(
                            async () => await product.save(),
                            async () => {
                                product.productTotalQuantity = originalProductQuantity;
                                await product.save();
                            }
                        );
                    }
                }
                // console.log("2")
            };

            await processInventoryChanges(oldBillData.billItems, newBill.billItems);

            // Account Updates
            const inventoryAccount = await IndividualAccount.findOne({ BusinessId, individualAccountName: "Inventory" });
            const cashAccount = await IndividualAccount.findOne({ BusinessId, individualAccountName: "Cash" });
            const accountsReceivableAccount = await IndividualAccount.findOne({ BusinessId, individualAccountName: "Account Receivables" });
            const oldCustomerAccount = await IndividualAccount.findOne({ BusinessId, customerId: oldBill.customer?._id });
            const newCustomerAccount = await IndividualAccount.findOne({ BusinessId, customerId: newBill.customer });
            const salesRevenueAccount = await IndividualAccount.findOne({ BusinessId, individualAccountName: "Sales Revenue" });

            const oldOutstandingAmount = oldTotalAmount - oldBillData.paidAmount - oldBillData.flatDiscount;
            const newOutstandingAmount = newTotalAmount - newBill.paidAmount - newBill.flatDiscount;
            const outstandingDifference = newOutstandingAmount - oldOutstandingAmount;

            const oldSalesRevenue = oldTotalAmount - oldBillData.flatDiscount - oldTotalPurchaseAmount;
            const newSalesRevenue = newTotalAmount - newBill.flatDiscount - newTotalPurchaseAmount;
            const salesRevenueDifference = newSalesRevenue - oldSalesRevenue;

            const paidAmountDifference = newBill.paidAmount - oldBillData.paidAmount;

            if (accountsReceivableAccount && outstandingDifference !== 0) {
                const originalReceivableBalance = accountsReceivableAccount.accountBalance;
                accountsReceivableAccount.accountBalance += outstandingDifference;

                transaction.addOperation(
                    async () => await accountsReceivableAccount.save(),
                    async () => {
                        accountsReceivableAccount.accountBalance = originalReceivableBalance;
                        await accountsReceivableAccount.save();
                    }
                );
            }
            // console.log("3")

            if (cashAccount && paidAmountDifference !== 0) {
                const originalCashBalance = cashAccount.accountBalance;
                cashAccount.accountBalance += paidAmountDifference;

                transaction.addOperation(
                    async () => await cashAccount.save(),
                    async () => {
                        cashAccount.accountBalance = originalCashBalance;
                        await cashAccount.save();
                    }
                );
            }

            if (inventoryAccount && amountDifference !== 0) {
                const originalInventoryBalance = inventoryAccount.accountBalance;
                inventoryAccount.accountBalance -= amountDifference;

                transaction.addOperation(
                    async () => await inventoryAccount.save(),
                    async () => {
                        inventoryAccount.accountBalance = originalInventoryBalance;
                        await inventoryAccount.save();
                    }
                );
            }
            // console.log("4")
            // console.log("oldbill", oldBill.customer, "newbill", newBill.customer)
            if (oldBill?.customer?._id.toString() !== newBill?.customer?.toString()) {
                if (oldCustomerAccount && oldOutstandingAmount !== 0) {
                    const originalOldCustomerBalance = oldCustomerAccount.accountBalance;
                    oldCustomerAccount.accountBalance -= oldOutstandingAmount;

                    if (oldCustomerAccount.mergedInto !== null) {
                        const mergedIntoAccount = await IndividualAccount.findById(oldCustomerAccount.mergedInto);
                        mergedIntoAccount.accountBalance -= oldOutstandingAmount;
                        await mergedIntoAccount.save();
                    }

                    transaction.addOperation(
                        async () => await oldCustomerAccount.save(),
                        async () => {
                            oldCustomerAccount.accountBalance = originalOldCustomerBalance;
                            await oldCustomerAccount.save();
                        }
                    );
                }

                if (newCustomerAccount && newOutstandingAmount !== 0) {
                    const originalNewCustomerBalance = newCustomerAccount.accountBalance;
                    newCustomerAccount.accountBalance += outstandingDifference;

                    if (newCustomerAccount.mergedInto !== null) {
                        const mergedIntoAccount = await IndividualAccount.findById(newCustomerAccount.mergedInto);
                        mergedIntoAccount.accountBalance += oldOutstandingAmount;
                        await mergedIntoAccount.save();
                    }

                    transaction.addOperation(
                        async () => await newCustomerAccount.save(),
                        async () => {
                            newCustomerAccount.accountBalance = originalNewCustomerBalance;
                            await newCustomerAccount.save();
                        }
                    );
                }
                // console.log("5")
            } else if (newCustomerAccount && outstandingDifference !== 0) {
                newCustomerAccount.accountBalance += outstandingDifference;
                if (newCustomerAccount.mergedInto !== null) {
                    const mergedIntoAccount = await IndividualAccount.findById(newCustomerAccount.mergedInto);
                    mergedIntoAccount.accountBalance += oldOutstandingAmount;
                    await mergedIntoAccount.save();
                }
                await newCustomerAccount.save();
            }

            // console.log("6")
            if (salesRevenueAccount && salesRevenueDifference !== 0) {
                salesRevenueAccount.accountBalance += salesRevenueDifference;
                await salesRevenueAccount.save();
            }

            Object.assign(oldBill, newBill);
            await oldBill.save();

            res.status(200).json(new ApiResponse(200, oldBill, "Bill updated successfully!"));
        });
    } catch (error) {
        throw new ApiError(500, `Transaction failed: ${error.message}`);
    }
});



const getBills = asyncHandler(async (req, res) => {
    const { billType, customer, billStatus, startDate, endDate } = req.query;

    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Authorization Failed!");
    }

    const BusinessId = user.BusinessId;

    // Build the filter query
    const query = { BusinessId };

    if (billType) query.billType = { $in: billType.split(",") };
    if (customer) query.customer = customer;
    if (billStatus) query.billStatus = { $in: billStatus.split(",") };
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
            $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        };
    }

    const bills = await Bill.find(query)
        .populate('customer', 'customerName')
        .populate({
            path: 'billItems.productId',
            select: 'productName productPurchasePrice'
        })
        .sort({ createdAt: -1 })
        .lean();

    const billsWithTotalQuantity = bills.map((bill) => {
        const totalQuantity = bill.billItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        return { ...bill, totalQuantity };
    });

    return res.status(200).json(new ApiResponse(200, billsWithTotalQuantity, "Bills retrieved successfully!"));
});


const getLastBillNo = asyncHandler(async (req, res) => {
    const { billType } = req.query;

    // Ensure the user is authorized
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Authorization Failed!");
    }

    const BusinessId = user.BusinessId;

    // Validate billType
    const validBillTypes = ["thermal", "A4"];
    if (!billType || !validBillTypes.includes(billType)) {
        throw new ApiError(400, `Invalid bill type! Valid types are: ${validBillTypes.join(", ")}`);
    }

    // Retrieve the business name
    const business = await Business.findById(BusinessId).select("businessName");
    if (!business || !business.businessName) {
        throw new ApiError(404, "Business not found or business name is missing!");
    }

    const businessName = business.businessName;
    const businessInitials = businessName
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("");

    // Query the last bill of the given type
    const lastBill = await Bill.findOne({ BusinessId, billType })
        .sort({ createdAt: -1 }) // Sort by most recent
        .select("billNo")
        .lean();

    let nextSequence = 1; // Default sequence for the first bill
    if (lastBill && lastBill.billNo) {
        // Extract numeric part from the last bill number
        const lastSequence = parseInt(lastBill.billNo.match(/\d+$/)?.[0], 10);
        if (!isNaN(lastSequence)) {
            nextSequence = lastSequence + 1;
        }
    }

    // Generate the next bill number
    let nextBillNo = "";
    if (billType === "A4") {
        nextBillNo = `A4${businessInitials}${nextSequence.toString().padStart(5, "0")}`;
    } else if (billType === "thermal") {
        nextBillNo = `TH${businessInitials}${nextSequence.toString().padStart(7, "0")}`;
    }

    // Respond with the next bill number
    return res.status(200).json(
        new ApiResponse(200, { nextBillNo }, "Next bill number retrieved successfully!")
    );
});

const getSingleBill = asyncHandler(async (req, res) => {
    const { billNo } = req.params;

    // Validate the user
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Authorization Failed!");
    }

    const BusinessId = user.BusinessId;

    // Validate bill number
    if (!billNo) {
        throw new ApiError(400, "Bill number is required!");
    }

    // Find the bill and populate all required details
    const bill = await Bill.findOne({ BusinessId, billNo })
        .populate({
            path: "customer",
            select: "customerName email mobileNo ntnNumber cnic customerRegion",
        })
        .populate({
            path: "BusinessId",
            select: "businessName businessRegion exemptedParagraph",
            populate: {
                path: "owner",
                select: "mobileno email",
            },
        })
        .populate({
            path: "salesPerson",
            select: "firstname lastname email role",
        })
        .populate({
            path: "billItems.productId",
            select: "productName productPack productUnit productPurchasePrice ",
            populate: [
                {
                    path: "companyId",
                    select: "companyName",
                },
                {
                    path: "typeId",
                    select: "typeName",
                },
            ],
        })
        .lean(); // Convert Mongoose document to plain JS object for easier manipulation

    if (!bill) {
        throw new ApiError(404, `No bill found with the number ${billNo}`);
    }

    // Respond with the bill details
    return res.status(200).json(
        new ApiResponse(200, bill, "Bill retrieved successfully!")
    );
});

const billPayment = asyncHandler(async (req, res) => {
    const { billId, amountPaid, flatDiscount } = req.body;

    // Validate the user
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Authorization Failed!");
    }

    const BusinessId = user.BusinessId;

    // Validate required fields
    if (!(billId || amountPaid)) {
        throw new ApiError(400, "Amount or discount required!");
    }

    if (amountPaid < 0) {
        throw new ApiError(400, "Amount paid must be greater than zero!");
    }

    const transactionManager = new TransactionManager();

    try {
        await transactionManager.run(async (transaction) => {
            // Fetch the bill
            const bill = await Bill.findOne({ billNo: billId, BusinessId });
            if (!bill) {
                throw new ApiError(404, "Bill not found!");
            }

            // Calculate remaining balance
            const remainingBalance = bill.totalAmount - bill.paidAmount - bill.flatDiscount;
            if (amountPaid > remainingBalance) {
                throw new ApiError(400, `Payment exceeds remaining balance! Remaining: ${remainingBalance}`);
            }

            // Update bill payments and status
            bill.paidAmount += amountPaid;
            if (bill.paidAmount + bill.flatDiscount >= bill.totalAmount) {
                bill.billStatus = "paid"; // Fully paid
            } else {
                bill.billStatus = "partiallypaid";
            }

            if (flatDiscount > 0) {
                bill.flatDiscount += flatDiscount;
            }

            transaction.addOperation(
                async () => await bill.save(),
                async () => await Bill.findByIdAndUpdate(bill._id, { paidAmount: bill.paidAmount - amountPaid, billStatus: "unpaid" })
            );

            // Fetch necessary accounts
            const [cashAccount, accountsReceivableAccount, customerIndividualAccount, salesRevenueAccount] = await Promise.all([
                IndividualAccount.findOne({ BusinessId, individualAccountName: "Cash" }),
                IndividualAccount.findOne({ BusinessId, individualAccountName: "Account Receivables" }),
                IndividualAccount.findOne({ BusinessId, customerId: bill.customer }),
                IndividualAccount.findOne({ BusinessId, individualAccountName: "Sales Revenue" }),
            ]);

            if (!accountsReceivableAccount || !customerIndividualAccount || !cashAccount || !salesRevenueAccount) {
                throw new ApiError(400, "Required accounts not found!");
            }

            // Deduct payment from accounts
            accountsReceivableAccount.accountBalance -= amountPaid;

            customerIndividualAccount.accountBalance -= (amountPaid + flatDiscount);

            if(customerIndividualAccount.mergedInto !== null){
                const mergedIntoAccount = await IndividualAccount.findById(customerIndividualAccount.mergedInto);
                mergedIntoAccount.accountBalance -= (amountPaid + flatDiscount);
                await mergedIntoAccount.save();
            }

            salesRevenueAccount.accountBalance -= flatDiscount;

            transaction.addOperation(
                async () => {
                    await accountsReceivableAccount.save();
                    await customerIndividualAccount.save();
                    await salesRevenueAccount.save();
                },
                async () => {
                    accountsReceivableAccount.accountBalance += amountPaid;
                    customerIndividualAccount.accountBalance += (amountPaid + flatDiscount);
                    salesRevenueAccount.accountBalance += flatDiscount;
                    await accountsReceivableAccount.save();
                    await customerIndividualAccount.save();
                    await salesRevenueAccount.save();
                }
            );

            // Add payment to cash account
            cashAccount.accountBalance += amountPaid;
            transaction.addOperation(
                async () => await cashAccount.save(),
                async () => {
                    cashAccount.accountBalance -= amountPaid;
                    await cashAccount.save();
                }
            );

            // Record payment in General Ledger
            await GeneralLedger.create([
                {
                    BusinessId,
                    individualAccountId: customerIndividualAccount.mergedInto !== null ? customerIndividualAccount.mergedInto : customerIndividualAccount._id,
                    details: `Bill Payment for Bill ${bill.billNo}`,
                    credit: amountPaid,
                    reference: customerIndividualAccount.mergedInto !== null ? customerIndividualAccount.mergedInto : customerIndividualAccount._id,
                },
            ]);

            return res.status(200).json(
                new ApiResponse(200, { bill }, "Payment recorded successfully!")
            );
        });
    } catch (error) {
        throw new ApiError(500, `Transaction failed: ${error.message}`);
    }
});

const billPosting = asyncHandler(async (req, res) => {
    const { billId } = req.body;

    // Validate the user
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Authorization Failed!");
    }

    const BusinessId = user.BusinessId;

    // Validate required fields
    if (!(billId)) {
        throw new ApiError(400, "bill No is required!");
    }

    const transactionManager = new TransactionManager();

    try {
        await transactionManager.run(async (transaction) => {
            // Fetch the bill
            const bill = await Bill.findOne({ billNo: billId, BusinessId });
            if (!bill) {
                throw new ApiError(404, "Bill not found!");
            }

            bill.isPosted = true;

            transaction.addOperation(
                async () => await bill.save(),
                async () => await Bill.findByIdAndUpdate(bill._id, { isPosted: false })
            );

            return res.status(200).json(
                new ApiResponse(200, { bill }, "Payment recorded successfully!")
            );
        });
    } catch (error) {
        throw new ApiError(500, `${error.message}`);
    }
});




export {
    registerBill,
    getBills,
    updateBill,
    getLastBillNo,
    getSingleBill,
    billPayment,
    billPosting
}