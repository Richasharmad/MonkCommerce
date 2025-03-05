
import React, { useState } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import '../../../src/App.css';
import Checkbox from '@mui/material/Checkbox';
import { TextField } from "@mui/material";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        overflowY: 'hidden',
        maxHeight: 'calc(100vh - 160px)',
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        position: 'sticky',
        bottom: 0,
        borderTop: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
    },
    '& .MuiPaper-root': {
        borderRadius: theme.shape.borderRadius * 2,
    },
}));



const SelectProductModal = ({ products, onOpen, onClose, onSelect }) => {
    const [checked, setChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleProductChange = (product) => {
        const productId = product.id;
        const productChecked = !(checked[productId] || false);
        setChecked(prev => ({ ...prev, [productId]: productChecked }));

        const newCheckedItems = { ...checkedItems };
        product.variants.forEach(variant => {
            newCheckedItems[variant.id] = productChecked;
        });
        setCheckedItems(newCheckedItems);
    }

    const handleItemChange = (variant) => {
        const variantId = variant.id;
        setCheckedItems(prev => ({ ...prev, [variantId]: !prev[variantId] }))
    }

    const handleSubmit = () => {
        const selectedVariants = [];

        products.forEach(product => {
            product.variants.forEach(variant => {
                if (checkedItems[variant.id]) {
                    selectedVariants.push({
                        productTitle: product.title,
                        variantTitle: variant.title,
                        variantPrice: variant.price,
                        id: product.id,
                    });
                }
            });
        });


        onSelect(selectedVariants);
        onClose();
    };

    const handleProductSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;


    return (
        <BootstrapDialog onClose={onClose} open={onOpen} aria-labelledby="customized-dialog-title" maxWidth="sm" fullWidth>

            <div className="modal">
                <div className="modal-content">
                    <div className="custom-divider">
                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Add Products

                            <TextField
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                placeholder="Search products..."
                                onChange={handleProductSearchChange}
                                value={searchTerm}
                                sx={{ width: '100%', mt: 2 }}
                            />

                        </DialogTitle>
                    </div>

                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon />
                    </IconButton>

                    <div className="custom-divider" style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                        {displayProducts && Array.isArray(displayProducts) ? displayProducts.map((product) => (
                            <div className="custom-divider" key={product.id}>

                                <div className="custom-divider">
                                    <Typography variant="body1" className="img-body">
                                        <Checkbox className="checkbox"
                                            checked={checked[product.id] || false}
                                            onChange={() => handleProductChange(product)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                        <img alt="" className="img-body2" src={product.image.src} width="50" height="50" />{product.title}
                                    </Typography>
                                </div>
                                <div className="product-variants">
                                    {product.variants && product.variants.map(variant => (
                                        <><Checkbox className="checkbox"
                                            checked={checkedItems[variant.id] || false}
                                            onChange={() => handleItemChange(variant)}
                                            inputProps={{ 'aria-label': 'controlled' }} /><Typography key={variant.id} variant="body2">
                                                <div className="variants-body" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div className="variant-title">{variant.title}</div>
                                                    <div> ₹{variant.price}</div>
                                                </div>
                                            </Typography></>

                                    ))}
                                </div>

                            </div>
                        )) : <Typography variant="body2">No products available.</Typography>}
                    </div>


                    <div className="modal-footer">
                        <DialogActions>
                            <button className="choose-cancel" autoFocus onClick={onClose}>
                                Cancel
                            </button>
                            <button className="choose-product" autoFocus onClick={handleSubmit} variant="contained" color="primary">Add</button>
                        </DialogActions>
                    </div>
                </div>
            </div>
        </BootstrapDialog>
    )
}

export default SelectProductModal;