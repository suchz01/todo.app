import React from 'react';
import TodoForm from './TodoForm';

const TodoFormContainer = ({ 
  showAddForm, 
  editingTodo, 
  handleUpdateTodo, 
  handleAddTodo, 
  setShowAddForm, 
  setEditingTodo 
}) => {
  if (!showAddForm && !editingTodo) return null;
  
  // console.log("TodoFormContainer - editingTodo:", editingTodo);
  
  return (
    <div 
      className="mb-4 bg-[#2a2a2a] p-4 rounded-lg border border-[#444444] todo-form-container"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <TodoForm 
        onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
        initialData={editingTodo}
        onCancel={() => {
          setShowAddForm(false);
          setEditingTodo(null);
        }}
      />
    </div>
  );
};

export default TodoFormContainer; 