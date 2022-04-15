import useSWR, { SWRConfig } from "swr";
import { useEffect, useState } from 'react';

import axios from '@/lib/axios';

const fetcher = (url) => fetch(url,  {
    headers: {
     'X-Requested-With': 'XMLHttpRequest',
 },
 withCredentials: true,
}).then((res) => res.json());
const API = "http://127.0.0.1:8000/api/todos";

export async function getServerSideProps() {
  console.log("10")
  const repoInfo = await fetcher(API);
  return {
    props: {
      fallback: {
        [API]: repoInfo
      }
    }
  };
}

const Todos = () => {
    const { data, error } = useSWR(API);

    // const getTodos = async () => {
    //     const fetchedTodos = await axios.get('/api/todos').then(res => {
    //         return res.data
    //     });
    //     console.log(fetchedTodos);
    //     setTodos(fetchedTodos);
    // }

    // useEffect(() => {
    //     getTodos();
    // }, [])
    // const corgo = JSON.parse(data);
    // console.log(corgo);

    return (
        <div className="container flex m-auto">
        <h1>Todos</h1>
        <ul>
            {data?.map((todo) => {
                return <li><p>{todo.title}</p><p>{todo.description}</p><input type="checkbox" checked={todo.completed}/></li>
            })}
            <li>
            <a href="/todos/1">Todo 1</a>
            </li>
            <li>
            <a href="/todos/2">Todo 2</a>
            </li>
            <li>
            <a href="/todos/3">Todo 3</a>
            </li>
        </ul>
        </div>
    );
    }

    export default function App({ fallback }) {
        return (
          <SWRConfig value={{ fallback }}>
            <Todos />
          </SWRConfig>
        );
      }