function InventoryCard({ item, onDelete }) {
    const productName = item.product_variants?.products?.name || "Unknown Product"
    const variantName = item.product_variants?.name || "No Variants"
    const storeName = item.stores?.name || "No Store"

    function getQuantityColor(quantity) {
        if (quantity >= 4) return 'green'
        if (quantity >= 2) return 'goldenrod'
        return 'red'
    }
    return ( 
        <div style={{
            border: '1px solid #ddd',
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            backgroundColor: '#fafafa'
        }}>
        
        <button
            onClick={() => {
                console.log("DELETE CLICKED", item.id)
                onDelete?.(item.id)
            }}
        >
            Delete
        </button>

        {/* Top: product */}
        <h3 style={{ marginBottom: 6 }}>
            {productName}
        </h3>

        {/* MID: context info*/}
        <p style={{ margin: 0 }}>
            <strong>Variant:</strong> {item.product_variants?.name}
        </p>

        <p style={{ marginTop: 4 }}>
            <strong>Store:</strong> {item.stores?.name}
        </p>

        <hr style={{ margin: '12px 0' }} />
        
        {/* BOTTOM: Inventory status rom */}
        <p style={{ margin: 0 }}>
            <strong>Quantity:</strong> {' '}
            <span style={{ color: getQuantityColor(item.quantity), fontWeight: 'bold' }}>
                {item.quantity}
            </span>
        </p>

        <p style={{ marginTop: 6 }}>
            <strong>Status:</strong> {item.status}
        </p>
        </div>
    )

}




export default InventoryCard