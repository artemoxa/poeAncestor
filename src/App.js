import React, { useState, useEffect } from 'react';
import ItemArray from './ItemArray';

function App() {
    const [fetchedData, setFetchedData] = useState([]); // Store the fetched data
    const [fetchedData2, setFetchedData2] = useState([]);
    const [data, setData] = useState([]);

    const url =
        'https://poe.ninja/api/data/itemoverview?league=Ancestor&type=Tattoo';
    const urlproxy = generateProxyUrl(url);

    // Define the base URL for the multi-URL fetch
    const baseItemUrl = 'https://poe.ninja/api/data/itemhistory?league=Ancestor&type=';

    useEffect(() => {
        // Fetch data from the first endpoint
        fetch(urlproxy)
            .then((response) => response.json())
            .then((actualData) => {
                // Assuming actualData is an object with a "lines" array
                const fetchedData = actualData.lines;
                setFetchedData(fetchedData); // Store the fetched data in state
                setData(fetchedData); // Initialize the data state with fetched data
            });

        const urlToNameMap = {
            [`${baseItemUrl}UniqueArmour&itemId=106711`]: "Ahuana's Bite",
            [`${baseItemUrl}UniqueAccessory&itemId=106651`]: "Kaom's Binding",
            [`${baseItemUrl}UniqueArmour&itemId=106544`]: "Utula's Hunger",
            [`${baseItemUrl}UniqueAccessory&itemId=106447`]: "Ikiaho's Promise",
            [`${baseItemUrl}UniqueWeapon&itemId=107035`]: "Rakiata's Dance",
            [`${baseItemUrl}UniqueArmour&itemId=106574`]: "Kiloava's Bluster",
            [`${baseItemUrl}UniqueAccessory&itemId=106478`]: "Tawhanuku's Timing",
            [`${baseItemUrl}UniqueWeapon&itemId=107146`]: "Maata's Teaching",
            [`${baseItemUrl}UniqueArmour&itemId=106451`]: "Kahuturoa's Certainty",
            [`${baseItemUrl}UniqueArmour&itemId=106590`]: "Akoya's Gaze"
        };

        // Perform multiple fetches for different itemIds
        const itemIds = Object.keys(urlToNameMap); // Get the itemIds from the map keys

        const fetchPromises = itemIds.map((itemId) =>
            fetch(generateProxyUrl(itemId))
                .then((response) => response.json())
                .then((itemData) => {
                    // Process the fetched itemData and return an item object with hardcoded name
                    return {
                        id: itemId,
                        name: urlToNameMap[itemId], // Get the name from the map
                        chaosValue: getChaosValueWhereDaysAgoIsZero(itemData),
                    };
                })
        );

        // Use Promise.all to wait for all fetches to complete
        Promise.all(fetchPromises)
            .then((results) => {
                // Combine the results into a single array
                setFetchedData2(results); // Store the second fetched data in state
            });
    }, [url]);

    const combinedData = fetchedData.concat(fetchedData2);
    // Create a function to filter items by filter criteria
    const filterAndSortItemsByCriteria = (criteria1, criteria2) => {
        const filteredItems = combinedData.filter(
            (item) => item.name.includes(criteria1) || item.name.includes(criteria2)
        );
        // Add uniq to filteredItems array
        // Sort filtered items by price (Chaos Orbs)
        const sortedItems = filteredItems.sort((a, b) => b.chaosValue - a.chaosValue);

        return sortedItems;
    };

    const getChaosValueWhereDaysAgoIsZero = (itemData) => {
        for (const item of itemData) {
            if (item.daysAgo === 0) {
                return item.value;
            }
        }
        return null; // Return null if not found
    };

    function generateProxyUrl(apiUrl) {
        const encodedUrl = encodeURIComponent(apiUrl);
        const proxyUrl = `https://europe-central2-impactful-post-399414.cloudfunctions.net/corsProxy/fetch?url=${encodedUrl}`;
        return proxyUrl;
    }

    // Filter the data for each criteria
    const ngamahuItems = filterAndSortItemsByCriteria('Ngamahu', 'Kaom');
    const tasalioItems = filterAndSortItemsByCriteria('Tasalio', 'Rakiata');
    const arohonguiItems = filterAndSortItemsByCriteria('Arohongui', 'Ikiaho');
    const valakoItems = filterAndSortItemsByCriteria('Valako', 'Kiloava');
    const hinekoraItems = filterAndSortItemsByCriteria('Hinekora', 'Tawhanuku');
    const tawhoaItems = filterAndSortItemsByCriteria('Maata', 'Tawhoa');
    const kitavaItems = filterAndSortItemsByCriteria('Utula', 'Kitava');
    const rongokuraiItems = filterAndSortItemsByCriteria('Kahuturoa', 'Rongokurai');
    const ramakoItems = filterAndSortItemsByCriteria('Ramako', 'Ahuana');
    const tukohamaItems = filterAndSortItemsByCriteria('Akoya', 'Tukohama');


    // Create an array of arrays with their respective sums
    const arrayData = [
        { title: "Kaom", items: ngamahuItems },
        { title: "Rakiata", items: tasalioItems },
        { title: "Ikiaho", items: arohonguiItems },
        { title: "Kiloava", items: valakoItems },
        { title: "Tawhanuku", items: hinekoraItems },
        { title: "Maata", items: tawhoaItems },
        { title: "Utula", items: kitavaItems },
        { title: "Kahuturoa", items: rongokuraiItems },
        { title: "Ahuana", items: ramakoItems },
        { title: "Akoya", items: tukohamaItems },
    ];
    const [sortOrder, setSortOrder] = useState('bySum'); // Default sorting order
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    // Sort the arrayData in descending order based on the sum
    const sortedArrayData = [...arrayData];

    if (sortOrder === 'bySum') {
        sortedArrayData.sort((a, b) => {
            const sumA = a.items.reduce((acc, item) => acc + parseFloat(item.chaosValue), 0);
            const sumB = b.items.reduce((acc, item) => acc + parseFloat(item.chaosValue), 0);
            return sumB - sumA;
        });
    } else if (sortOrder === 'byMostExpensive') {
        sortedArrayData.sort((a, b) => {
            const maxA = Math.max(...a.items.map((item) => parseFloat(item.chaosValue)));
            const maxB = Math.max(...b.items.map((item) => parseFloat(item.chaosValue)));
            return maxB - maxA;
        });
    }

    return (
        <div>
            <h1>My Items</h1>
            <div>
                <label htmlFor="sortOrder">Sort Order: </label>
                <select id="sortOrder" onChange={handleSortChange} value={sortOrder}>
                    <option value="bySum">Sort by Sum of Chaos Value</option>
                    <option value="byMostExpensive">Sort by Most Expensive Item</option>
                </select>
            </div>
            <div className="item-array-container">
                {sortedArrayData.map((data) => (
                    <div key={data.title} className="item-array">
                        <ItemArray title={data.title} items={data.items} />
                    </div>
                ))}
            </div>
        </div>
    );
}


export default App;

