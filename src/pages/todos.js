import useSWR, { SWRConfig, useSWRConfig } from 'swr'
import { useState } from 'react'

import axios from '@/lib/axios'
import Todo from '@/components/Todo'

const endpoints = {
    list: '/api/todos',
}

const initialTodoFormData = {
    title: '',
    description: '',
}

export async function getServerSideProps() {
    const { data: repoInfo } = await axios.get(endpoints.list)
    return {
        props: {
            fallback: {
                [endpoints.list]: repoInfo,
            },
        },
    }
}

const dataMutator = (oldObj, newData) => {
    return { ...oldObj, ...newData }
}

// TODO:
// 2. Use CSS Grid
// 3. The Form could be its own component separate from the list.
// 4. Consider a getter and setter for data objects. Such as getting the id from a todo.
const Todos = () => {
    const [newTodo, setNewTodo] = useState(initialTodoFormData)
    const { data } = useSWR(endpoints.list, () =>
        axios.get(endpoints.list).then(res => res.data),
    )
    const { mutate } = useSWRConfig()

    const updateTodo = async (id, newData) => {
        await axios.put(`${endpoints.list}/${id}`, newData)
        mutate(endpoints.list)
    }

    const createTodo = async newData => {
        await axios.post(endpoints.list, newData)
        mutate(endpoints.list)
    }

    const deleteTodo = async todo => {
        await axios.delete(`${endpoints.list}/${todo.id}`)
        mutate(endpoints.list)
    }

    const handleTodoChange = e => {
        setNewTodo({
            ...newTodo,
            [e.target.name]: e.target.value,
        })
    }

    /** This method updates the server first then tells the SWR cache that the key "/api/todos" has been updated.
     * Note: the fetch is intertwined with the form element handler.
     */
    const handleTodoCreate = async e => {
        e.preventDefault()
        await createTodo(newTodo)
        setNewTodo(initialTodoFormData)
    }

    // Should separate the update logic from the todo check logic as update will expand.
    // const handleTodoUpdate = async (e, todo) => {
    //     // e.preventDefault()
    //     console.log(e.target.name, e.target.checked)
    //     console.log(todo)
    //     const newData = { ...todo, [e.target.name]: e.target.checked }
    //     updateTodo(todo.id, newData)
    // }
    // Refactored to spread data into an object.
    // Sends full object to the server.
    const handleTodoUpdate = (todo, newDataObj) => {
        updateTodo(todo.id, dataMutator(todo, newDataObj))
    }

    return (
        <div className="container flex">
            <div className="container flex justify-center">
                <h1>Create New Todo</h1>
                <div className="flex items-center">
                    <div className="w-1/2 flex flex-col items-center">
                        <form onSubmit={handleTodoCreate}>
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={newTodo.title}
                                onChange={handleTodoChange}
                            />

                            <label htmlFor="description">Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={newTodo.description}
                                onChange={handleTodoChange}
                            />

                            <button className="btn btn-primary">Create</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1>Todos</h1>
                <ul>
                    {data?.map(todo => {
                        return (
                            <Todo
                                key={todo.id}
                                handleTodoUpdate={handleTodoUpdate}
                                deleteTodo={deleteTodo}
                                todo={todo}
                            />
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default function App({ fallback }) {
    return (
        <SWRConfig value={{ fallback }}>
            <Todos />
        </SWRConfig>
    )
}
