function InventoryCard({ item }) {
    return ( 
        <div style={{
            border: '1px solid gray',
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: '#f5f5f5'
        }}
    >
        <h3>
            {item.product_variants?.products?.name}
        </h3>

        <p>
            <strong>Variant:</strong> {item.product_variants?.name}
        </p>

        <p>
            <strong>Store:</strong> {item.stores?.name}
        </p>

        <p>
            <strong>Quantity:</strong> {item.quantity}
        </p>

        <p>
            <strong>Status:</strong> {item.status}
        </p>
    </div>
    )
}

export default InventoryCard