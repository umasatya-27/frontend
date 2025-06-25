import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [changeItem, setChangeItem] = useState('');
  const [editItemId, setEditItemId] = useState(null);

  // Fetch items on load
  useEffect(() => {
    fetchItems();
  }, []);

  // GET all items
  const fetchItems = () => {
    fetch('http://localhost:5000/items/')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching items:', err));
  };

  // POST new item
  const addItem = () => {
    fetch('http://localhost:5000/items/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem }),
    })
      .then(() => {
        setNewItem('');
        fetchItems();
      })
      .catch(err => console.error('Add error:', err));
  };

  // PUT update item
  const updateItem = () => {
    if (!editItemId) return alert("Select an item to update.");

    fetch(`http://localhost:5000/items/${editItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: changeItem }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update item');
        return response.json();
      })
      .then(() => {
        setChangeItem('');
        setEditItemId(null);
        fetchItems();
      })
      .catch(error => console.error('Update error:', error));
  };

  // DELETE item
  const deleteItem = (id) => {
    fetch(`http://localhost:5000/items/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchItems())
      .catch(err => console.error('Delete error:', err));
  };

  // Prefill update field
  const startEdit = (id, name) => {
    setEditItemId(id);
    setChangeItem(name);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Item List from Node Backend</h1>

      {items.map(item => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <strong>{item.name}</strong>
          <button onClick={() => startEdit(item.id, item.name)} style={{ marginLeft: "10px" }}>
            Edit
          </button>
          <button onClick={() => deleteItem(item.id)} style={{ marginLeft: "5px", color: "red" }}>
            Delete
          </button>
        </div>
      ))}

      <hr />

      <h2>Add New Item</h2>
      <input
        placeholder="Enter a name"
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={addItem}>Add</button>

      <hr />

      <h2>Update Item</h2>
      <input
        type="text"
        value={changeItem}
        onChange={(e) => setChangeItem(e.target.value)}
        placeholder="Update item name"
      />
      <button onClick={updateItem}>Update</button>
    </div>
  );
}

export default App;
