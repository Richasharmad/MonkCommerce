import React, { useState, useEffect, useCallback } from "react";
import '../../../src/App.css'
import SelectProductModal from '../popups/modal';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableProduct, VariantList } from '../common/DragDrop';
import update from 'immutability-helper';


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showProductModal, setProductModal] = useState(false);
    const [showVarints, setShowVariants] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(null);

    useEffect(() => {
        addNewSelection();
    }, [addNewSelection]);

    const fetchProducts = (index) => {
        fetch(`https://stageapi.monkcommerce.app/task/products/search?search=Hat`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-api-key": "72njgfa948d9aS7gs5"
            },
        })
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setProductModal(true);
                setCurrentIndex(index);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    const handleProductSelect = (product) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[currentIndex] = product;
        setSelectedProducts(updatedProducts);
        setProductModal(false);
    };


    const handleRemoveProduct = (index) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts.splice(index, 1);
        setSelectedProducts(updatedProducts);
    };

    const addNewSelection = useCallback(() => {
        setSelectedProducts(selectedProducts => [...selectedProducts, null]);
    }, []);
    

    const handleShowHideVariants = (index) => {
        setShowVariants(prevShowVariants => ({
            ...prevShowVariants,
            [index]: !prevShowVariants[index]
        }));
    };


    const handleRemoveVariants = (productIndex, variantIndex) => {
        const updatedProducts = [...selectedProducts];
        if (updatedProducts[productIndex] && updatedProducts[productIndex][variantIndex]) {
            updatedProducts[productIndex].splice(variantIndex, 1);
        }
        setSelectedProducts(updatedProducts);
    };


    const moveProduct = (dragIndex, hoverIndex) => {
        const dragProduct = selectedProducts[dragIndex];
        const updatedProducts = update(selectedProducts, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragProduct]
            ],
        });
        setSelectedProducts(updatedProducts);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <p className="add-products">Add Products</p>
                {selectedProducts.map((selectedProduct, index) => (
                    <div key={index}>
                        <div className="product">Product</div>
                        <div className="discount">Discount</div>
                        <div className="parent-product">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <DraggableProduct
                                    key={index}
                                    product={selectedProduct && selectedProduct.length > 0 && selectedProduct[0]?.productTitle ? selectedProduct[0]?.productTitle : 'Select Product'}
                                    index={index}
                                    moveProduct={moveProduct}
                                    onRemoveProduct={(index) => handleRemoveProduct(index)}
                                    onEdit={fetchProducts}
                                />

                            </div>
                        </div>

                        <div style={{ marginLeft: '210px' }}>
                            <button className="show-variant-link" onClick={() => handleShowHideVariants(index)} style={{ background: 'none', border: 'none', color: '#0bbff1', cursor: 'pointer', textDecoration: 'underline' }}>
                                {showVarints[index] ? 'Hide Variants' : 'Show Variants'}
                                {showVarints[index] ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                            </button>
                        </div>

                        {
                            showVarints[index] && selectedProduct && selectedProduct.length > 0 && (
                                <VariantList
                                    variants={selectedProduct.map((variant, variantIndex) => ({
                                        id: variantIndex,
                                        variantTitle: variant.variantTitle,
                                    }))}
                                    onRemoveVariant={(variantIndex) => handleRemoveVariants(index, variantIndex)}
                                />
                            )
                        }

                    </div>
                ))}
                {showProductModal && (
                    <SelectProductModal products={products} onOpen={() => setProductModal(true)} onClose={() => setProductModal(false)} onSelect={handleProductSelect} />
                )}
                <button className="add-product" onClick={addNewSelection}>Add Product</button>
            </div>
        </DndProvider>
    );

};

export default ProductList;