import axios from 'axios';
import conf from '../conf/conf.js';
import authService from './auth.js';



export class Config {
    constructor() {
        this.client = axios.create({
            // baseURL: BASE_URL,
            baseURL: conf.appwriteUrl,
            withCredentials: true,

        });


        this.client.interceptors.response.use(
            response => response,
            async error => {
                console.log("interceptor", error.response.request.status)
                if (error.response?.request.status === 401) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );

    }

    async fetchAllProducts() {
        try {
            const response = await this.client.get('/product/get-products',
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                    }
                }
            );

            if (response.data) {

                return response.data;
            } else {
                console.error("Fetching all Products Failed:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Error in Fetching all Products:", error);
            throw error;
        }
    }


    // async fetchProduct({ itemCode }) {
    //     try {
    //         const response = await this.client.get(`/api/store/product/${itemCode}`);

    //         if (response.data && response.data.isSucceed && response.data.message) {
    //             const data = response.JSON()
    //             return data;
    //         } else {
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error("Error in Fetching Product:", error);
    //         throw error;
    //     }
    // }

    async createCategory(...props) {
        try {
            // console.log("Creating category: ", ...props)
            const response = await this.client.post(`/product/add-category`, JSON.stringify(
                ...props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("categories: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in Creating Category:", error);
            throw error;
        }
    }

    async updateCategory(...props) {
        try {
            const response = await this.client.patch(`/product/update-category`, JSON.stringify(
                ...props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("categories: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in updating Category:", error);
            throw error;
        }
    }

    async fetchAllCategories() {
        try {
            const response = await this.client.get(`/product/get-categories`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("categories: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in Fetching Categories:", error);
            throw error;
        }
    }

    async createType(...props) {
        try {
            const response = await this.client.post(`/product/add-type`, JSON.stringify(
                ...props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("type: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in Creating Type:", error);
            throw error;
        }
    }

    async getProductsWithoutBarcode(search) {
        try {
            const response = await this.client.get(`/product/get-products-without-barcode?barcodeExists=false&search=${search}`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("type: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in Creating Type:", error);
            throw error;
        }
    }

    async getExpiryReport(days) {
        try {
            const response = await this.client.get(`/product/expiry-report?days=${days}`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("expiryReport: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in expiry report:", error);
            throw error;
        }
    }

    async printBarcodes(productIds) {
        try {
            const response = await this.client.post(`product/barcode-pdf`,
                productIds,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'blob',
                });

            if (response.data) {
                console.log("pdfs: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in Creating PDF for barcodes:", error);
            throw error;
        }
    }

    async updateType(...props) {
        try {
            const response = await this.client.patch(`/product/update-type`, JSON.stringify(
                ...props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("type: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in updating Type:", error);
            throw error;
        }
    }

    async fetchAllTypes() {
        try {
            const response = await this.client.get(`/product/get-types`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("types: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in Fetching types:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const response = await this.client.delete(`/product/${id}`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log(response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in deleting product:", error);
            throw error;
        }
    }


    async registerStock({ ...props }) {
        try {
            const response = await this.client.post(`/product/add-product`, JSON.stringify({
                ...props
            }),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log(response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in registering Product:", error);
            throw error;
        }
    }

    // async increaseStock({ supplier = '', ...props }) {
    //     // console.log({itemCode, quantity, supplier})

    //     console.log(props.quantity, props.id, supplier)
    //     const quantity = props.quantity
    //     try {
    //         const response = await this.client.patch(`/api/Store/IncreaseStock/${props.id}`, JSON.stringify({
    //             quantity, supplier
    //         }),
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: ` Bearer ${authService.getToken()}`,
    //                 }
    //             });

    //         if (response) {
    //             console.log(response);
    //             // return response;
    //         } else {
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error("Error in Increasing stock:", error);
    //         throw error;
    //     }
    // }

    async decreaseStock({ ...props }) {
        // console.log({itemCode, quantity, supplier})

        const quantity = props.quantity
        const reason = props.reason
        console.log(quantity, reason)
        try {
            const response = await this.client.patch(`/api/Store/DecreaseStock/${props.id}`, JSON.stringify({
                quantity, reason
            }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: ` Bearer ${authService.getToken()}`,
                    }
                });

            if (response) {
                console.log(response);
                // return response;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in decreasing stock:", error);
            throw error;
        }
    }

    // async billPayment(
    //     {
    //         billId, amount
    //     }) {
    //     try {
    //         const response = await this.client.patch(`/api/Store/UpdateBillPayment/${billId}`, JSON.stringify({
    //             amount
    //         }),
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: ` Bearer ${authService.getToken()}`,
    //                 }
    //             });

    //         if (response) {
    //             // console.log(response);
    //             return response.data;
    //         } else {
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error("Error in bill Payment:", error);
    //         throw error;
    //     }
    // }

    async fetchAllBills(filters = {}) {
        try {
            // Construct query string from filters object
            const query = new URLSearchParams(filters).toString();
            const url = `/bill/get-bills${query ? `?${query}` : ''}`;

            // Send GET request with headers and query parameters
            const response = await this.client.get(url, {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response && response.data) {
                console.log("All bills: ", response.data);
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Fetching all bills:", error);
            throw error;
        }
    }

    // async fetchBillData() {
    //     try {
    //         const response = await this.client.get(`/api/Store/OnBillLoading`,
    //             {
    //                 headers: {
    //                     Authorization: ` Bearer ${authService.getToken()}`,
    //                     'Content-Type': 'application/json'
    //                 }
    //             });

    //         if (response) {
    //             return response.data;
    //         } else {
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error("Error in Fetching Data for bill:", error);
    //         throw error;
    //     }
    // }

    async fetchSingleBill(billNo) {
        console.log(billNo)
        try {
            const response = await this.client.get(`/bill/get-single-bill/${billNo}`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response) {
                console.log('response.data', response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Fetching Single  bill:", error);
            throw error;
        }
    }


    async createInvoice({ ...props }) {
        try {
            console.log("invoice data:", props);
            const response = await this.client.post(`/bill/add-bill`, JSON.stringify(
                props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

            if (response) {
                console.log(response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Generating Invoice:", error);
            throw error;
        }
    }

    async createSaleReturn({ ...props }) {
        try {
            console.log("sale return data:", props);
            const response = await this.client.post(`/saleReturn/add-saleReturn`, JSON.stringify(
                props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

            if (response) {
                console.log(response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Generating Sale return:", error);
            throw error;
        }
    }

    async createPurchaseReturn({ ...props }) {
        try {
            console.log("purchase return data:", props);
            const response = await this.client.post(`/purchase/register-purchaseReturn`, JSON.stringify(
                props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

            if (response) {
                console.log(response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Generating purchase return:", error);
            throw error;
        }
    }

    async updateInvoice(...props) {
        try {
            const response = await this.client.patch(`/bill/update-bill`, JSON.stringify(
                ...props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("Invoice updated: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in updating invoice:", error);
            throw error;
        }
    }
    async postBill(billId) {
        try {
            const response = await this.client.patch(`/bill/bill-posting`, JSON.stringify(
                { billId: billId }
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data) {
                console.log("Invoice updated: ", response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error in updating invoice:", error);
            throw error;
        }
    }

    async fetchAllCustomers() {
        try {
            const response = await this.client.get(`/store/get-customers`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`
                    }
                });

            if (response.data) {
                console.log("all cust: ", response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Fetching Customers:", error);
            throw error;
        }
    }

    async fetchAllSuppliers() {
        try {
            const response = await this.client.get(`/store/get-suppliers`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`
                    }
                });

            if (response.data) {
                console.log("all suppliers: ", response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Fetching suppliers:", error);
            throw error;
        }
    }

    async fetchAllCompanies() {
        try {
            const response = await this.client.get(`/store/get-companies`,
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`
                    }
                });

            if (response.data) {
                console.log("all companies: ", response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Fetching companies:", error);
            throw error;
        }
    }


    async addCustomer({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/store/add-customer', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed Adding Customer:", error)
            throw error
        }
    }

    async deleteCustomer(customerId) {
        try {
            const response = await this.client.delete(`/store/delete-customer/${customerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response) {
                console.log("Delete Response:", response.data);
                return response.data;
            }
        } catch (error) {
            console.log("Failed Deleting Customer:", error);
            throw error;
        }
    }

    async addSupplier({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/store/add-supplier', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed Adding Supplier:", error)
        }
    }

    async addCompany({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/store/add-company', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed Adding company:", error)
        }
    }

    async updateCustomer({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.patch('/store/update-customer', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed updating Customer:", error)
        }
    }

    async updateSupplier({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.patch('/store/update-supplier', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed updating supplier:", error)
        }
    }

    async updateCompany({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.patch('/store/update-company', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed updating company:", error)
        }
    }

    async updateProduct({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.patch('/product/update-product', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed updating Product:", error)
        }
    }
    async getReports(params) {
        console.log(params);
        try {
            const response = await this.client.get('/product/get-report', {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                params // ✅ this attaches your query params to the request
            });

            if (response.data) {
                console.log("config Res: ", response.data);
                return response.data;
            }
        } catch (error) {
            console.log("Failed getting reports:", error);
        }
    }

    async billPayment({ ...data }) {
        try {
            const response = await this.client.post(`/bill//bill-payment`, JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log(response.data)
                return response.data
            }
        } catch (error) {
            console.log("Failed Submitting Payment:", error)
            throw error;
        }
    }

    async getAccounts() {
        try {
            const response = await this.client.get(`/account/get-accounts`,
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                });

            if (response.data) {
                console.log("all accounts: ", response.data)
                return response.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in Fetching accounts:", error);
            throw error;
        }
    }

    async addIndividualAccount({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/account/add-individualAccount', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error Adding Account:", error)
            throw error
        }
    }

    async updateIndividualAccount(individualAccountId, { ...data }) {
        console.log("updating: ", individualAccountId, data)
        try {

            const response = await this.client.patch('/account/update-individualAccount', JSON.stringify({
                individualAccountId,
                ...data
            }),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error Updating Account:", error)
            throw error
        }
    }

    async addSubCategory({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/account/add-subCategory', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error Adding Sub category:", error)
            throw error
        }
    }

    async updateSubCategory(subAccountId, { ...data }) {
        console.log("updating: ", subAccountId, data)
        try {

            const response = await this.client.patch('/account/update-subCategory', JSON.stringify({
                subAccountId,
                ...data
            }),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error Updating Account:", error)
            throw error
        }
    }

    async addAccount({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/account/add-account', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error Adding Account:", error)
            throw error
        }
    }

    async updateAccount(accountId, { ...data }) {
        console.log("updating: ", accountId, data)
        try {

            const response = await this.client.patch('/account/update-account', JSON.stringify({
                accountId,
                ...data
            }),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error Updating Account:", error)
            throw error
        }
    }

    async getAccountReceivables() {
        try {
            const response = await this.client.get(`/account/get-accountReceivables`,
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                });

            if (response.data) {
                console.log("all account receivables: ", response.data?.data)
                return response.data?.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in Fetching account receivables:", error);
            throw error;
        }
    }

    async getLastBillNo(billType) {
        console.log(billType);
        try {
            const response = await this.client.get(
                `/bill/get-lastBillNo?billType=${encodeURIComponent(billType)}`, // Pass billType as a query param
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            );

            if (response.data) {
                console.log("Last Bill No: ", response.data);
                return response.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in Fetching last bill no:", error);
            throw error;
        }
    }

    async createPurchase({ ...props }) {
        try {
            console.log("purchase data:", props);
            const response = await this.client.post(`/purchase/register-purchase`, JSON.stringify(
                props
            ),
                {
                    headers: {
                        Authorization: ` Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

            if (response) {
                console.log(response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Generating Purchase:", error);
            throw error;
        }
    }

    async fetchAllPurchases(filters = {}) {
        try {
            // Construct query string from filters object
            const query = new URLSearchParams(filters).toString();
            const url = `/purchase/get-purchases${query ? `?${query}` : ''}`;

            // Send GET request with headers and query parameters
            const response = await this.client.get(url, {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response && response.data) {
                console.log("All purchases: ", response.data);
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Fetching all purchases:", error);
            throw error;
        }
    }

    async postExpense({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/account/post-expense', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error posting expense:", error)
            throw error
        }
    }

    async postVendorJournalEntry({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/account/post-vendorEntry', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error posting expense:", error)
            throw error
        }
    }

    async postCustomerJournalEntry({ ...data }) {
        console.log(data)
        try {
            const response = await this.client.post('/account/post-customerEntry', JSON.stringify(
                data
            ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log("config Res: ", response.data)
                return response.data
            }
        } catch (error) {
            console.log("Error posting customer entry:", error)
            throw error
        }
    }

    async getGeneralLedger() {
        try {
            const response = await this.client.get(`/account/get-generalLedgers`,
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                });

            if (response.data) {
                console.log("all account receivables: ", response.data)
                return response.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in Fetching account receivables:", error);
            throw error;
        }
    }
    async getDashboardData(filterType = "monthly") {
        try {
            const response = await this.client.get(
                `/dashboard/get-dashboardData`,
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    },
                    params: {
                        filter: filterType  // filterType could be: daily, weekly, monthly, 6months, yearly
                    }
                }
            );

            if (response.data) {
                console.log("dashboard data: ", response.data);
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in fetching dashboard data:", error);
            throw error;
        }
    }


    async mergeAccounts({ ...data }) {
        try {
            const response = await this.client.post(`/account/merge-accounts`,
                JSON.stringify(
                    data
                ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                return response.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in merging account:", error);
            throw error;
        }
    }

    async getInventoryDetails() {
        try {
            const response = await this.client.get(`/account/get-inventory-data`,

                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                console.log(response.data.data)
                return response.data.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in fetching inventory details:", error);
            throw error;
        }
    }


    async openCloseAccountBalance({ endpoint: endpoint, formData }) {
        console.log('opening account balance called')
        console.log('endpoint', endpoint)
        try {
            const response = await this.client.post(`/account/${endpoint}`,
                JSON.stringify(
                    formData
                ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                return response.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in opening account balance:", error);
            throw error;
        }
    }

    async getPreviousBalance(customerId) {
        try {
            const response = await this.client.get(`/account/get-previous-balance`, {
                params: { customerId },
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data) {
                console.log(response.data.data)
                return response.data.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in fetching previous Balance:", error);
            throw error;
        }
    }

    async getIncomeStatement(filter) {
        try {
            const response = await this.client.get(`/account/get-income-statement?${filter}`, {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data) {
                console.log(response.data)
                return response.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in generating income statement:", error);
            throw error;
        }
    }

    async mergeBills(data) {
        try {
            const response = await this.client.post(`/bill/merge-bills`,
                JSON.stringify(
                    data
                ),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (response.data) {
                return response.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error in Merging bills:", error);
            throw error;
        }
    }


    // Whatsapp APIs

    async initWhatsapp() {
        try {
            const response = await this.client.get(`/whatsapp/init`, {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                },
            });
            if (response.data) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error initializing WhatsApp:", error);
            throw error;
        }
    }

    async getQrCode() {
        try {
            const response = await this.client.get(`/whatsapp/qr`, {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                },
            });
            if (response.data) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching QR Code:", error);
            throw error;
        }
    }

    async checkWhatsappStatus() {
        try {
            const response = await this.client.get(`/whatsapp/status`, {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                },
            });
            if (response.data) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error checking WhatsApp status:", error);
            throw error;
        }
    }
    
    async sendWhatsappMessage(data) {
        try {
            const response = await this.client.post(`/whatsapp/send-message`,
                JSON.stringify(data),
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.data) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error sending WhatsApp message:", error);
            throw error;
        }
    }

    async getDailyReports(dateRange) {
        try {
            const response = await this.client.get(`/reports/daily-reports?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
                headers: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                },
            });
            console.log('response', response)
            if (response.data) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting daily reports:", error);
            throw error;
        }
    }



}

const config = new Config();


export default config;
