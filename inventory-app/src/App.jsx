import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import InventoryCard from './components/InventoryCard'

function App() {
  const [inventory, setInventory] = useState([])
  const [quantity, setQuantity] = useState('')
  const [status, setStatus] = useState('in stock')
  const [variantId, setVariantId] = useState('')
  const [storeId, setStoreId] = useState('')

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          id,
          quantity,
          status,
          stores ( name ),
          product_variants (
            name,
            products ( name )
          )
        `)

        console.log("RAW INVENTORY DATA:", data)

      if (error) {
        console.log("ERROR:", error)
      } else {
        setInventory(data)
      }
    }


    loadData()
  }, [])

  async function addInventoryItem() {
    const { data, error } = await supabase
      .from('inventory')
      .insert([
        {
          quantity: Number(quantity),
          status,
          product_variant_id: variantId,
          store_id: storeId
        }
      ])
      .select()
    
    if (error) {
      console.log(error)
    } else {
      setInventory(prev => [...prev, ...data])
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Inventory Live Test</h1>

      {inventory.length === 0 && <p>No data yet (or blocked by RLS)</p>}

      <div style={{ marginBottom: 20, padding: 12, border: '1px soild #ccc' }}>
        <h3>Add inventory Item</h3>

        <input 
          placeholder="Variant ID"
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Store ID"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <br /><br />
        <button onClick={addInventoryItem}>
          Add Item
        </button>
      </div>
      {inventory.map(item => (
        <InventoryCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  )
}

export default App