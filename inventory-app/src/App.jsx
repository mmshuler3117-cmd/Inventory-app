import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import InventoryCard from './components/InventoryCard'

function App() {
  const [inventory, setInventory] = useState([])

  // FORM STATE
  const [quantity, setQuantity] = useState('')
  const [status, setStatus] = useState('in stock')
  const [variantId, setVariantId] = useState('')
  const [storeId, setStoreId] = useState('')
  const [loading, setLoading] = useState(false)

  // DROPDOWN DATA
  const [stores, setStores] = useState([])
  const [variants, setVariants] = useState([])

  const canSubmit = 
    quantity &&
    variantId &&
    storeId &&
    status

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        (payload) => {
          console.log("REALTIME EVENT:", payload)
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadData() {

    // LOAD INVENTORY
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select(`
        id,
        quantity,
        status,
        stores!store_id ( name ),
        product_variants!variant_id (
          name,
          products ( name )
        )
      `)

    console.log("RAW INVENTORY:", inventoryData)

    if (inventoryError) {
      console.log("INVENTORY ERROR:", inventoryError)
    } else {
     setInventory(inventoryData)
    }

   // LOAD STORES
   const { data: storeData, error: storeError } = await supabase
     .from('stores')
     .select('*')

    if (storeError) {
      console.log("STORE ERROR:", storeError)
    } else {
      setStores(storeData)
    }

    // LOAD PRODUCT VARIANTS
    const { data: variantData, error: variantError } = await supabase
      .from('product_variants')
      .select(`
        id,
        name,
        products (
          name
        )
      `)

    console.log("VARIANTS RAW:", variantData)

    if (variantError) {
      console.log("VARIANT ERROR:", variantError)
    } else {
      setVariants(variantData)
    }
  }

  async function addInventoryItem() {
    if (!canSubmit) return

    setLoading(true)

    const { error } = await supabase
      .from('inventory')
      .insert([
        {
          quantity: Number(quantity),
          status,
          variant_id: variantId,
          store_id: storeId
        }
      ])

    setLoading(false)

    if (error) {
      console.log("INSERT ERROR:", error)
    } else {

      // CLEAR FORM
      setQuantity('')
      setVariantId('')
      setStoreId('')
      setStatus('in stock')
    }
  }

  async function deleteInventoryItem(id) {
    console.log("DELETING:", id)

    const {data, error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)
      .select()
    
      console.log("DELETED ROW:", data)
      console.log("DELETE ERROR:", error)
    }
  
  return (
    <div style={{ padding: 20 }}>
      <h1>Inventory Live Test</h1>

      {/* ADD ITEM FORM */}
      <div
        style={{
          marginBottom: 20,
          padding: 12,
          border: '1px solid #ccc',
          borderRadius: 10
        }}
      >
        <h3>Add Inventory Item</h3>

        {/* VARIANT DROPDOWN */}
        <select
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
        >
          <option value="">Select Flavor</option>

          {variants.map(variant => (
            <option
              key={variant.id}
              value={variant.id}
            >
              {variant.products?.name} - {variant.name}
            </option>
          ))}
        </select>

        <br /><br />

        {/* STORE DROPDOWN */}
        <select
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
        >
          <option value="">Select Store</option>

          {stores.map(store => (
            <option
              key={store.id}
              value={store.id}
            >
              {store.name}
            </option>
          ))}
        </select>

        <br /><br />

        {/* QUANTITY */}
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <br /><br />

        {/* STATUS */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="in stock">In Stock</option>
          <option value="ordered">Ordered</option>
          <option value="back order">Back Order</option>
          <option value="discontinued">Discontinued</option>
        </select>

        <br /><br />

        <button 
          onClick={addInventoryItem}
          disabled={!canSubmit || loading}
          style={{
            opacity: !canSubmit ? 0.5 : 1,
            cursor: !canSubmit ? 'not-allowed' : 'pointer'
          }}
        >

          {loading ? "Adding..." : "Add Item"}
        </button>
      </div>

      {/* INVENTORY LIST */}
      {inventory.map(item => (
        <InventoryCard
          key={item.id}
          item={item}
          onDelete={deleteInventoryItem}
        />
      ))}
    </div>
  )
}

export default App