import InlineEdit from '@/components/InlineEditInput'

export default function Todo(props) {
    const { todo, handleTodoUpdate, deleteTodo } = props

    return (
        <li>
            <InlineEdit
                initialValue={todo.title}
                onSubmit={newVal => handleTodoUpdate(todo, { title: newVal })}
            />
            <InlineEdit
                initialValue={todo.description}
                onSubmit={newVal =>
                    handleTodoUpdate(todo, { description: newVal })
                }
            />

            <input
                name="completed"
                type="checkbox"
                checked={todo.completed}
                onChange={e =>
                    handleTodoUpdate(todo, { completed: e.target.checked })
                }
            />
            <button type="button" onClick={() => deleteTodo(todo)}>
                X
            </button>
        </li>
    )
}
