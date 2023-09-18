import React, { useState } from 'react';
import './ItemArray.css';
function ItemArray({ title, items }) {
    const sumChaosValue = items.reduce((acc, item) => acc + parseFloat(item.chaosValue), 0);

    const [showDetails, setShowDetails] = useState(false);

    if (items.length === 0) {
        return (
            <div>
                <h2>{title}</h2>
                <p>Total Chaos Value: 0</p>
                <p>No items available</p>
            </div>
        );
    }

    const mostExpensiveItem = items.reduce((maxItem, currentItem) => {
        const maxChaosValue = parseFloat(maxItem.chaosValue);
        const currentChaosValue = parseFloat(currentItem.chaosValue);
        return currentChaosValue > maxChaosValue ? currentItem : maxItem;
    }, items[0]);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div>
            <h2>{title}</h2>
            <p>Total Chaos Value: {Math.round(sumChaosValue)}</p>
            <p>{mostExpensiveItem.name}, {Math.round(mostExpensiveItem.chaosValue)}</p>
            <button onClick={toggleDetails}>
                {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            {showDetails && (
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            {item.name},  {Math.round(item.chaosValue)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ItemArray;
