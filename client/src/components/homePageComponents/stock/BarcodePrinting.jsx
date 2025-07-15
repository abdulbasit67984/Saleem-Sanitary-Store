import React, { useState, useRef } from 'react';
import { Button, Box, Grid, Typography, Checkbox, Paper, TextField } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import { ReactToPrint } from 'react-to-print';
import axios from 'axios';
import config from '../../../features/config';
import authService from '../../../features/auth';
import conf from '../../../conf/conf';

const BarcodePrinting = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const printRef = useRef();

    

    const fetchProductsWithoutBarcodes = async () => {
        setIsLoading(true);
        try {
            const response = await config.getProductsWithoutBarcode(searchTerm);
            console.log('response', response)
            setProducts(response);
            setSelectedProducts([]);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p._id));
        }
    };

    const handlePrint = async () => {
        if (selectedProducts.length === 0) return;

        try {
            const token = authService.getAccessToken();
            const response = await axios.post(
                `${conf.appwriteUrl}/product/barcode-pdf`,
                { productIds: selectedProducts },
                {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Open the PDF in a new tab for user to print
            const printWindow = window.open(url);
            if (printWindow) {
                printWindow.focus();
                printWindow.print();
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };


    return (
        <div className='overflow-y-auto'>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Barcode Printing
                </Typography>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Search Products"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchProductsWithoutBarcodes()}
                                InputProps={{
                                    endAdornment: <SearchIcon />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={fetchProductsWithoutBarcodes}
                                disabled={isLoading}
                                fullWidth
                            >
                                {isLoading ? 'Loading...' : 'Find Products Without Barcodes'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {products.length > 0 && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">
                                Products Without Barcodes ({products.length})
                            </Typography>
                            <Box>
                                <Checkbox
                                    checked={selectedProducts.length === products.length && products.length > 0}
                                    indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                                    onChange={handleSelectAll}
                                />
                                <span>Select All</span>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            {products.map((product) => (
                                <Grid item xs={12} sm={6} md={4} key={product._id}>
                                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={selectedProducts.includes(product._id)}
                                            onChange={() => handleSelectProduct(product._id)}
                                        />
                                        <Box sx={{ ml: 2 }}>
                                            <Typography variant="body1">{product.productName}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                SKU: {product.sku || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {selectedProducts.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                        >
                            Print Selected Barcodes ({selectedProducts.length})
                        </Button>
                    </Box>
                )}

                {/* Hidden component for printing */}
                <div style={{ display: 'none' }}>
                    <div ref={printRef}>
                        {selectedProducts.map((productId) => {
                            const product = products.find(p => p._id === productId);
                            if (!product) return null;

                            return (
                                <div key={productId} style={{ margin: '20px', display: 'inline-block' }}>
                                    <img
                                        src={`/api/barcode/image/${productId}`}
                                        alt={`Barcode for ${product.productName}`}
                                        style={{ width: '200px', height: '100px' }}
                                    />
                                    <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                        {product.productName.substring(0, 20)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Box>
        </div>
    );
};

export default BarcodePrinting;