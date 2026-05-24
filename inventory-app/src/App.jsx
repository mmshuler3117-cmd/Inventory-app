import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import InventoryCard from './components/InventoryCard'

function App() {
  const [inventory, setInventory] = useState([])

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

  return (
    <div style={{ padding: 20 }}>
      <h1>Inventory Live Test</h1>

      {inventory.length === 0 && <p>No data yet (or blocked by RLS)</p>}

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