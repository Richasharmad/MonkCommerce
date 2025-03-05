import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const DraggableHandle = ({ drag }) => {
    return (
        <div ref={drag} style={{ cursor: 'grab', marginRight: '10px', display: 'flex' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[...Array(3)].map((_, index) => (
                    <div key={index} style={{ width: '5px', height: '5px', backgroundColor: 'grey', borderRadius: '50%' }}></div>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginLeft: '2px' }}>
                {[...Array(3)].map((_, index) => (
                    <div key={`second-col-${index}`} style={{ width: '5px', height: '5px', backgroundColor: 'grey', borderRadius: '50%' }}></div>
                ))}
            </div>
        </div>
    );
};


const DraggableVariant = ({ variant, index, moveVariant, onRemoveVariant }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'variant',
        item: { id: variant?.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'variant',
        hover(item) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex !== hoverIndex) {
                moveVariant(dragIndex, hoverIndex);
                item.index = hoverIndex;
            }
        },
    });

    preview(drop(ref));

    return (
        <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <div style={{ marginRight: '10px', marginTop: "20px", fontSize: '10px' }}>
                <DraggableHandle drag={drag} />
            </div>

            <div ref={ref} style={{
                opacity: isDragging ? 0.5 : 1,
                flexGrow: 1,
                backgroundColor: 'white',
                borderRadius: '60px',
                border: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                height: '25px',
                overflow: 'hidden',
                marginTop: "20px"
            }}
            >
                <span style={{ fontSize: '14px', color: '#333' }}>{variant}</span>
            </div>

            <div style={{ marginLeft: '10px', marginTop: "20px" }}>
                <CloseIcon
                    onClick={() => onRemoveVariant(index)}
                    style={{ cursor: 'pointer', color: 'black' }} />
            </div>
        </div>
    );
};


const DraggableProduct = ({ product, index, moveProduct, children, onRemoveProduct, onEdit }) => {

    const [showDiscount, setShowDiscount] = useState(false);
    const [discountValue, setDiscountValue] = useState('');
    const [discountType, setDiscountType] = useState('');

    const handleDiscountChange = (event) => {
        setDiscountType(event.target.value);
    };

    const handleDiscountValueChange = (event) => {
        setDiscountValue(event.target.value);
    };

    const toggleDiscountField = () => {
        setShowDiscount(!showDiscount);
    };

    const ref = useRef(null);

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'product',
        item: { id: product?.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'product',
        hover(item) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex !== hoverIndex) {
                moveProduct(dragIndex, hoverIndex);
                item.index = hoverIndex;
            }
        },
    });

    preview(drop(ref));

    return (
        <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <div style={{ marginRight: '10px', marginTop: "20px", fontSize: '10px' }}>
                <DraggableHandle drag={drag} />
            </div>
            <span style={{ fontSize: '15px', marginLeft: '5px', color: 'black', marginTop: '23px' }}>
                {index + 1}.
            </span>

            <div ref={ref} style={{
                opacity: isDragging ? 0.5 : 1,
                flexGrow: 1,
                backgroundColor: 'white',

                border: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                height: '25px',
                overflow: 'hidden',
                marginTop: "20px"
            }}
            >
                <span style={{ fontSize: '14px', color: '#333', width: '500px', textAlign: 'left' }}>{product}</span>
                <EditIcon
                    fontSize="small"
                    color="disabled"
                    style={{ marginLeft: "10px", cursor: "pointer", color: 'green' }}
                    onClick={() => onEdit(index)}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', marginTop: "20px" }}>
                {!showDiscount && (
                    <>
                        <button className="add-discount" onClick={toggleDiscountField}>Add Discount</button>
                        <CloseIcon onClick={() => onRemoveProduct(index)} style={{ cursor: 'pointer', color: 'black', marginLeft: '10px' }} />
                    </>
                )}

                {showDiscount && (
                    <>
                        <input
                            type="text"
                            placeholder="0"
                            value={discountValue}
                            onChange={handleDiscountValueChange}
                            style={{ height: '40px', width: "80px", marginRight: '10px' }}
                        />
                        <FormControl sx={{ minWidth: 80 }} size="small">
                            <Select
                                value={discountType}
                                onChange={handleDiscountChange}
                                displayEmpty
                                style={{ marginRight: '10px', backgroundColor: 'white', height: '47px' }}
                            >
                                <MenuItem value=""><em>% off</em></MenuItem>
                                <MenuItem value="flat">flat off</MenuItem>
                            </Select>
                        </FormControl>
                        <CloseIcon onClick={() => onRemoveProduct(index)} style={{ cursor: 'pointer', color: 'black', marginLeft: '10px' }} />
                    </>
                )}
            </div>
        </div>
    );
};



const VariantList = ({ variants, onRemoveVariant }) => {
    const [items, setItems] = useState(variants);

    const moveVariant = (dragIndex, hoverIndex) => {
        const dragItem = items[dragIndex];
        setItems(update(items, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragItem]
            ],
        }));
    };

    return (
        <div style={{ marginLeft: '110px', width: '700px' }}>
            {items?.map((item, index) => (
                <DraggableVariant
                    key={item.id}
                    variant={item.variantTitle}
                    index={index}
                    moveVariant={moveVariant}
                    onRemoveVariant={onRemoveVariant}
                />
            ))}
        </div>
    );
};
export { DraggableProduct, VariantList };